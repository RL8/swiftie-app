<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';
    import * as d3 from 'd3';

    const music = getContext<() => MusicContext>('music')();

    // Initialize with default display option
    let selectedDisplayOption = $state(1);
    const displayOptions = [
        { id: 1, name: 'List' },
        { id: 2, name: 'Grid' },
        { id: 3, name: 'Sunburst' }
    ];

    function handleBack() {
        goto(`${base}/albums/results`);
    }

    function isColorLight(color: string) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    }

    let mounted = $state(false);
    let showAlbum1 = $state(false);
    let showAlbum2 = $state(false);
    let showAlbum3 = $state(false);
    
    // D3 Sunburst visualization
    let sunburstContainer = $state<HTMLElement | null>(null);
    let tooltipInfo = $state({ 
        visible: false, 
        text: '', 
        subtext: '',
        x: 0, 
        y: 0 
    });
    let sunburstNeedsUpdate = $state(false);
    
    // Prepare hierarchical data for Sunburst
    function prepareSunburstData() {
        interface TreeNode {
            name: string;
            color: string;
            children?: TreeNode[];
            value?: number;
        }
        
        const root: TreeNode = {
            name: music.userName,
            color: "#F43F5E",
            children: []
        };
        
        music.selectedAlbums.forEach(album => {
            const albumNode: TreeNode = {
                name: album.title,
                color: album.color,
                children: []
            };
            
            const songs = music.selectedSongsByAlbum.get(album.id) || [];
            songs.forEach(song => {
                albumNode.children?.push({
                    name: song,
                    color: album.color,
                    value: 1
                });
            });
            
            root.children?.push(albumNode);
        });
        
        return root;
    }
    
    // Create the Sunburst visualization
    function createSunburst() {
        if (!sunburstContainer || selectedDisplayOption !== 3) return;
        
        // Clear any existing visualization
        d3.select(sunburstContainer).selectAll("*").remove();
        
        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;
        
        // Create SVG
        const svg = d3.select(sunburstContainer)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        
        // Create hierarchical data
        const data = prepareSunburstData();
        const hierarchyRoot = d3.hierarchy(data)
            .sum(d => (d as any).value || 0);
        
        // Create partition layout
        const partition = d3.partition<typeof data>()
            .size([2 * Math.PI, radius]);
        
        // Set up arc generator with explicit typing
        const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => Math.max(0, d.y0))
            .outerRadius(d => Math.max(0, d.y1));
        
        // Calculate the root
        const root = partition(hierarchyRoot);
        
        // Draw arcs
        const path = svg.selectAll("path")
            .data(root.descendants())
            .enter()
            .append("path")
            .attr("d", d => arc(d as any))
            .style("fill", d => (d.data as any).color || "#F43F5E")
            .style("opacity", d => d.depth === 0 ? 1 : 0.9)
            .style("stroke", "white")
            .style("stroke-width", 1)
            .style("cursor", "pointer")
            .on("mouseover", (event: MouseEvent, d: any) => {
                d3.select(event.currentTarget as Element)
                    .style("opacity", 1)
                    .style("stroke-width", 2);
                
                // Show tooltip
                tooltipInfo = {
                    visible: true,
                    text: d.data.name,
                    subtext: d.depth === 2 ? `from ${d.parent.data.name}` : (d.depth === 0 ? "Artist" : "Album"),
                    x: event.clientX,
                    y: event.clientY
                };
            })
            .on("mousemove", (event: MouseEvent) => {
                tooltipInfo = { ...tooltipInfo, x: event.clientX, y: event.clientY };
            })
            .on("mouseout", (event: MouseEvent) => {
                d3.select(event.currentTarget as Element)
                    .style("opacity", (d: any) => d.depth === 0 ? 1 : 0.9)
                    .style("stroke-width", 1);
                
                // Hide tooltip
                tooltipInfo = { ...tooltipInfo, visible: false };
            });
        
        // Add labels for larger sections
        svg.selectAll("text")
            .data(root.descendants().filter(d => d.depth === 0 || d.depth === 1))
            .enter()
            .append("text")
            .attr("transform", (d: any) => {
                // For the root node (depth 0), position at center
                if (d.depth === 0) {
                    return "translate(0,0)";
                }
                
                // For album nodes (depth 1), position in the middle of the arc
                const x = (d.x0 + d.x1) / 2;
                const y = (d.y0 + d.y1) / 2;
                const angle = (x - Math.PI / 2);
                const rotation = angle * (180 / Math.PI);
                
                // Adjust text positioning based on angle
                return `translate(${Math.cos(angle) * y},${Math.sin(angle) * y}) rotate(${rotation})`;
            })
            .style("text-anchor", (d: any) => d.depth === 0 ? "middle" : ((d.x0 + d.x1) / 2 > Math.PI ? "end" : "start"))
            .style("font-size", (d: any) => d.depth === 0 ? "14px" : "10px")
            .style("font-weight", "bold")
            .style("fill", (d: any) => isColorLight((d.data as any).color) ? "#000" : "#fff")
            .style("pointer-events", "none")
            .style("user-select", "none")
            .text((d: any) => d.depth === 0 ? d.data.name : (d.data.name.length > 12 ? d.data.name.substring(0, 10) + "..." : d.data.name));
            
        sunburstNeedsUpdate = false;
    }
    
    // Using $effect instead of $: for runes mode
    $effect(() => {
        if (mounted && selectedDisplayOption === 3 && sunburstContainer) {
            // Use setTimeout to ensure DOM is ready
            setTimeout(() => createSunburst(), 0);
        }
    });

    onMount(() => {
        mounted = true;
        
        // Start animation sequence after a short delay
        setTimeout(() => {
            // Start animation for first album
            showAlbum1 = true;
            
            // Then second album (with delay)
            setTimeout(() => {
                showAlbum2 = true;
                
                // Then third album (with delay)
                setTimeout(() => {
                    showAlbum3 = true;
                    
                    // Initialize sunburst if that's the selected view
                    if (selectedDisplayOption === 3) {
                        createSunburst();
                    }
                }, 200);
            }, 200);
        }, 300);
    });
    
    // Update Sunburst when the display option changes
    $effect(() => {
        if (selectedDisplayOption === 3 && mounted) {
            // Use setTimeout to ensure the DOM is ready
            setTimeout(() => createSunburst(), 100);
        }
    });
    
    // Update Sunburst when data changes
    $effect(() => {
        if (sunburstNeedsUpdate && selectedDisplayOption === 3 && mounted) {
            // Use setTimeout to ensure the DOM is ready
            setTimeout(() => createSunburst(), 100);
            sunburstNeedsUpdate = false;
        }
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            title="Share Your Top 3"
            subtitle="Choose how to display your favorites" />
    {/snippet}

    <div class="flex-1 p-6">
        <div class="display-options">
            <h3 class="options-title">Display Options</h3>
            <div class="options-container">
                {#each displayOptions as option}
                    <button 
                        class="option-button {selectedDisplayOption === option.id ? 'active' : ''}"
                        onclick={() => selectedDisplayOption = option.id}
                    >
                        {option.name}
                    </button>
                {/each}
            </div>
        </div>

        {#if selectedDisplayOption === 1}
            <!-- Default View (Same as results page) -->
            {#if mounted}
                <div class="results-container">
                    <h2 class="personal-header">{music.userName}'s Taylor Swift Favorites</h2>
                    {#if showAlbum1}
                        <div class="album-result" in:fly={{y: 20, duration: 400, delay: 100}}>
                            <div class="heart-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                <span class="heart-number">1</span>
                            </div>
                            <div class="album-container" transition:fade={{duration: 300}}>
                                <div class="album-display">
                                    <VinylRecord
                                        coverArt={music.selectedAlbums[0].coverArt}
                                        title={music.selectedAlbums[0].title}
                                        selected={true}
                                        selectionNumber={1}
                                        badgePosition="none"
                                        showSelectionOverlay={false}
                                        showGrooves={true}
                                        class_="results-vinyl"
                                    />
                                    <div class="song-list">
                                        <ul class="songs">
                                            {#each music.selectedSongsByAlbum.get(music.selectedAlbums[0].id) || [] as song, i}
                                                <div class="song-wrapper">
                                                    <span class="song-rank" style="color: {music.selectedAlbums[0].color}">{i + 1}</span>
                                                    <li class="song-item" style="background-color: {music.selectedAlbums[0].color}; color: {isColorLight(music.selectedAlbums[0].color) ? '#000' : '#fff'}">
                                                        {song}
                                                    </li>
                                                </div>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if showAlbum2}
                        <div class="album-result" in:fly={{y: 20, duration: 400, delay: 300}}>
                            <div class="heart-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                <span class="heart-number">2</span>
                            </div>
                            <div class="album-container" transition:fade={{duration: 300}}>
                                <div class="album-display">
                                    <VinylRecord
                                        coverArt={music.selectedAlbums[1].coverArt}
                                        title={music.selectedAlbums[1].title}
                                        selected={true}
                                        selectionNumber={2}
                                        badgePosition="none"
                                        showSelectionOverlay={false}
                                        showGrooves={true}
                                        class_="results-vinyl"
                                    />
                                    <div class="song-list">
                                        <ul class="songs">
                                            {#each music.selectedSongsByAlbum.get(music.selectedAlbums[1].id) || [] as song, i}
                                                <div class="song-wrapper">
                                                    <span class="song-rank" style="color: {music.selectedAlbums[1].color}">{i + 1}</span>
                                                    <li class="song-item" style="background-color: {music.selectedAlbums[1].color}; color: {isColorLight(music.selectedAlbums[1].color) ? '#000' : '#fff'}">
                                                        {song}
                                                    </li>
                                                </div>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}

                    {#if showAlbum3}
                        <div class="album-result" in:fly={{y: 20, duration: 400, delay: 500}}>
                            <div class="heart-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                <span class="heart-number">3</span>
                            </div>
                            <div class="album-container" transition:fade={{duration: 300}}>
                                <div class="album-display">
                                    <VinylRecord
                                        coverArt={music.selectedAlbums[2].coverArt}
                                        title={music.selectedAlbums[2].title}
                                        selected={true}
                                        selectionNumber={3}
                                        badgePosition="none"
                                        showSelectionOverlay={false}
                                        showGrooves={true}
                                        class_="results-vinyl"
                                    />
                                    <div class="song-list">
                                        <ul class="songs">
                                            {#each music.selectedSongsByAlbum.get(music.selectedAlbums[2].id) || [] as song, i}
                                                <div class="song-wrapper">
                                                    <span class="song-rank" style="color: {music.selectedAlbums[2].color}">{i + 1}</span>
                                                    <li class="song-item" style="background-color: {music.selectedAlbums[2].color}; color: {isColorLight(music.selectedAlbums[2].color) ? '#000' : '#fff'}">
                                                        {song}
                                                    </li>
                                                </div>
                                            {/each}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    <div class="share-info">
                        <span class="shared-by">Shared by: {music.userName}</span>
                    </div>
                </div>
            {/if}
        {:else if selectedDisplayOption === 2}
            <div class="grid-view" in:fade={{duration: 300}}>
                <div class="grid-header">
                    <h2 class="grid-title">{music.userName}'s Taylor Swift Favorites</h2>
                </div>
                <div class="albums-grid">
                    {#each music.selectedAlbums as album, albumIndex}
                        <div class="grid-album-card" style="border-color: {album.color}">
                            <div class="grid-album-header" style="background-color: {album.color}; color: {isColorLight(album.color) ? '#000' : '#fff'}">
                                <div class="grid-album-number">{albumIndex + 1}</div>
                                <h3 class="grid-album-title">{album.title}</h3>
                            </div>
                            <div class="grid-album-content">
                                <img src={album.coverArt} alt="{album.title} cover art" class="grid-album-image" />
                                <div class="grid-songs">
                                    <h4 class="grid-songs-title">My Top 3 Songs:</h4>
                                    <ul class="grid-songs-list">
                                        {#each music.selectedSongsByAlbum.get(album.id) || [] as song, i}
                                            <li class="grid-song-item" style="border-left: 3px solid {album.color};">
                                                <span class="grid-song-number">{i + 1}</span> {song}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="grid-footer">
                    <p class="shared-by-text">Curated by {music.userName}</p>
                </div>
            </div>
        {:else if selectedDisplayOption === 3}
            <div class="sunburst-view" in:fade={{duration: 300}}>
                <h2 class="personal-header">{music.userName}'s Taylor Swift Collection</h2>
                <div class="sunburst-container">
                    <div class="d3-sunburst" bind:this={sunburstContainer}></div>
                    {#if tooltipInfo.visible}
                        <div class="tooltip" 
                             style="left: {tooltipInfo.x + 15}px; top: {tooltipInfo.y + 15}px;">
                            <div class="tooltip-text">{tooltipInfo.text}</div>
                            {#if tooltipInfo.subtext}
                                <div class="tooltip-subtext">{tooltipInfo.subtext}</div>
                            {/if}
                        </div>
                    {/if}
                </div>
                
                <div class="sunburst-legend">
                    {#each music.selectedAlbums as album, i}
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: {album.color};"></div>
                            <div class="legend-label">{album.title}</div>
                        </div>
                    {/each}
                </div>
                <div class="share-info">
                    <span class="shared-by">Shared by: {music.userName}</span>
                </div>
            </div>
        {/if}
    </div>

    {#snippet footer()}
        <Footer variant="button">
            <div class="button-container">
                <Button 
                    variant="primary"
                    onclick={handleBack}
                >
                    Back
                </Button>
                <Button 
                    variant="secondary"
                    disabled={false}
                >
                    Export
                </Button>
            </div>
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .results-container {
        display: flex;
        flex-direction: column;
        gap: var(--grid-gap-sm, 1rem);
        max-width: var(--container-max-width, 32rem);
        margin: 0 auto;
        padding: 1rem;
    }

    .album-result {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: var(--shadow-md);
        padding: 1rem;
        position: relative;
    }

    .album-container {
        background: white;
        border-radius: var(--radius-lg, 1rem);
        padding: 0.75rem;
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
        transition: transform var(--duration-fast, 0.15s) var(--timing-function, ease-out);
        touch-action: manipulation;
    }

    .album-container:active {
        transform: scale(0.99);
    }

    .album-display {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        position: relative;
    }

    :global(.results-vinyl) {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
    }

    .song-list {
        flex-grow: 1;
        max-height: 120px;
        overflow-y: auto;
    }

    .song-wrapper {
        display: flex;
        align-items: center;
        gap: var(--space-1, 0.25rem);
        margin-bottom: 0.125rem;
    }

    .song-rank {
        font-size: 0.8rem;
        min-width: 1rem;
        text-align: right;
    }

    .song-item {
        padding: var(--space-1, 0.2rem) var(--space-2, 0.375rem);
        border-radius: var(--radius-md, 0.5rem);
        font-size: 0.9rem;
        transition: transform var(--duration-fast, 0.15s) var(--timing-function, ease-out);
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }

    .song-item:active {
        transform: scale(0.98);
    }

    .songs {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    @keyframes heartbeat {
        0% { transform: scale(1); }
        14% { transform: scale(1.1); }
        28% { transform: scale(1); }
        42% { transform: scale(1.1); }
        70% { transform: scale(1); }
    }

    .heart-badge {
        position: absolute;
        top: -1rem;
        left: -1rem;
        width: 3.6rem;
        height: 3.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-overlay, 30);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: heartbeat var(--duration-medium, 2s) ease-in-out infinite;
    }

    .heart-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        color: var(--color-primary, rgb(244, 63, 94));
    }

    .heart-number {
        position: relative;
        color: var(--text-light, white);
        font-weight: bold;
        font-size: 1.25rem;
        z-index: 11;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }

    .button-container {
        display: flex;
        gap: 0.75rem;
        width: 100%;
        justify-content: center;
    }

    .display-options {
        margin-bottom: 1.5rem;
    }

    .options-title {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .options-container {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .option-button {
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md, 0.5rem);
        background-color: var(--bg-button-secondary, rgb(248, 250, 252));
        border: 1px solid var(--border-color, rgb(226, 232, 240));
        font-size: 0.9rem;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .option-button.active {
        background-color: var(--color-primary, rgb(244, 63, 94));
        color: white;
        border-color: var(--color-primary, rgb(244, 63, 94));
    }

    .grid-view {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        border-radius: var(--radius-lg, 1rem);
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
    }

    .grid-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        background-color: var(--color-primary, rgb(244, 63, 94));
        color: white;
        border-radius: var(--radius-md, 0.5rem) var(--radius-md, 0.5rem) 0 0;
    }

    .grid-title {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
    }

    .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1rem;
    }

    .grid-album-card {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--border-color, rgb(226, 232, 240));
        border-radius: var(--radius-md, 0.5rem);
        box-shadow: var(--shadow-sm, 0 2px 4px -1px rgba(0, 0, 0, 0.06));
    }

    .grid-album-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border-radius: var(--radius-md, 0.5rem) var(--radius-md, 0.5rem) 0 0;
    }

    .grid-album-number {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0;
    }

    .grid-album-title {
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
    }

    .grid-album-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .grid-album-image {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: var(--radius-md, 0.5rem);
    }

    .grid-songs {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .grid-songs-title {
        font-size: 0.9rem;
        font-weight: bold;
        margin: 0;
    }

    .grid-songs-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .grid-song-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem;
        border-radius: var(--radius-sm, 0.25rem);
    }

    .grid-song-number {
        font-size: 0.8rem;
        font-weight: bold;
        margin: 0;
    }

    .sunburst-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 1rem auto;
        max-width: var(--container-max-width, 32rem);
    }

    .sunburst-container {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

    .d3-sunburst {
        width: 100%;
        height: 400px;
        margin: 0 auto;
    }

    .tooltip {
        position: fixed;
        padding: 0.5rem 0.75rem;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: var(--radius-sm, 0.25rem);
        font-size: 0.875rem;
        pointer-events: none;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .tooltip-text {
        font-weight: bold;
    }
    
    .tooltip-subtext {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-top: 0.25rem;
    }

    .sunburst-legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .legend-color {
        width: 1rem;
        height: 1rem;
        border-radius: var(--radius-sm, 0.25rem);
    }

    .legend-label {
        font-size: 0.875rem;
    }

    .personal-header {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
        color: var(--color-primary);
    }

    .share-info {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
        font-style: italic;
    }
    
    .shared-by {
        padding: 0.25rem 0.5rem;
        background-color: var(--color-background-light);
        border-radius: 1rem;
    }

    .grid-footer {
        margin-top: 1rem;
        text-align: center;
        color: var(--color-text-muted);
        font-style: italic;
    }
    
    .shared-by-text {
        font-size: 0.9rem;
        margin: 0;
    }
</style>
