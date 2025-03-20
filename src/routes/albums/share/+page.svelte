<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount, tick } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';
    import T3x3SunburstStandalone from '$lib/components/visualizations/T3x3SunburstStandalone.svelte';

    const music = getContext<() => MusicContext>('music')();

    // Initialize with default display option
    let selectedDisplayOption = $state(0);
    const displayOptions = [
        { id: 0, name: 'Layered' },
        { id: 1, name: 'List' },
        { id: 2, name: 'Grid' },
        { id: 3, name: 'Free Style' }
    ];

    // State for the Layered view
    let showLayeredChart = $state(true); // Initialize as true to show immediately

    function handleBack() {
        goto(`${base}/albums/results`);
    }

    function handleDisplayOptionChange(id: number) {
        selectedDisplayOption = id;
        if (id === 0) {
            // No delay needed since we want to show it immediately
            showLayeredChart = true;
        }
    }

    function initializeLayeredView() {
        showLayeredChart = true;
    }

    function isColorLight(color: string) {
        // Handle empty or undefined values
        if (!color) return true;
        
        // Remove the hash if it exists
        color = color.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        
        // Calculate brightness (using the formula for relative luminance)
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return true if the color is light (brightness > 0.6)
        return brightness > 0.6;
    }

    let mounted = $state(false);
    let showAlbum1 = $state(false);
    let showAlbum2 = $state(false);
    let showAlbum3 = $state(false);

    let username = "User";
    let personalMessage = "Thanks for checking out my top Taylor Swift picks! These are the songs that mean the most to me.";

    // Grid view toggle for alternative layouts
    let gridViewAlternative = $state(false);
    
    // Free style form
    let freeStyleSuggestion = $state("");
    let pastSuggestions: string[] = $state([]);
    
    function submitSuggestion() {
        if (freeStyleSuggestion.trim()) {
            pastSuggestions = [freeStyleSuggestion, ...pastSuggestions];
            freeStyleSuggestion = "";
        }
    }

    // Album-specific fonts for Taylor Swift albums
    const albumFonts = {
        'Taylor Swift': "'Times New Roman', serif",
        'Fearless': "'Georgia', serif",
        'Speak Now': "'Brush Script MT', cursive",
        'Red': "'Helvetica Neue', sans-serif",
        '1989': "'Futura', sans-serif", 
        'reputation': "'Helvetica Neue', sans-serif",
        'Lover': "'Serif', serif",
        'folklore': "'Garamond', serif",
        'evermore': "'Garamond', serif",
        'Midnights': "'Helvetica Neue', sans-serif",
        'The Tortured Poets Department': "'Courier New', monospace"
    };
    
    function getAlbumFont(albumTitle: string): string {
        // Type assertion to fix TypeScript indexing error
        return (albumFonts as Record<string, string>)[albumTitle] || "'Helvetica Neue', sans-serif";
    }

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
                }, 200);
            }, 200);
        }, 300);
        
        // Initialize layered view immediately
        showLayeredChart = true;
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            title="Share Your Top 3"
            subtitle="Choose how to display your favorites" />
    {/snippet}

    <div class="display-options">
        {#each displayOptions as option}
            <button 
                class="option-button {selectedDisplayOption === option.id ? 'active' : ''}"
                onclick={() => handleDisplayOptionChange(option.id)}
            >
                {option.name}
            </button>
        {/each}
    </div>

    <div class="flex-1 p-6">
        {#if selectedDisplayOption === 0}
            <!-- Layered View -->
            {#if showLayeredChart}
                <div in:fade={{duration: 300}} class="w-full">
                    <T3x3SunburstStandalone 
                        height="600px"
                        centerLabel={music.userName} 
                        title="My Taylor Swift Top 3×3" />
                </div>
            {/if}
        {:else if selectedDisplayOption === 1}
            <!-- Default View (Same as results page) -->
            {#if mounted}
                <div class="results-container">
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
                </div>
            {/if}
        {:else if selectedDisplayOption === 2}
            <!-- Grid View with toggle between versions -->
            <div class="flex justify-center mb-4">
                <div class="grid-toggle">
                    <span class="grid-toggle-label {!gridViewAlternative ? 'active' : ''}">Style 1</span>
                    <label class="toggle-switch">
                        <input type="checkbox" bind:checked={gridViewAlternative}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="grid-toggle-label {gridViewAlternative ? 'active' : ''}">Style 2</span>
                </div>
            </div>
            
            {#if !gridViewAlternative}
                <!-- Grid View Style 1 -->
                <div class="grid-view" in:fade={{duration: 300}}>
                    <div class="grid-container">
                        <!-- Top Left: Top 3 Albums -->
                        <div class="grid-cell albums-cell" style="background-color: {music.selectedAlbums[0].color}; color: {isColorLight(music.selectedAlbums[0].color) ? '#000' : '#fff'}">
                            <div class="albums-proportional">
                                <!-- Show albums in horizontal layout with specified proportions (45%, 33%, 22%) -->
                                <div class="albums-horizontal-container">
                                    <div class="album-item album-rank-1-horizontal">
                                        <img src={music.selectedAlbums[0].coverArt} alt={music.selectedAlbums[0].title} class="album-img" style="width: 100%; height: 100%; object-fit: cover; padding: 0;" />
                                        <div class="album-rank">1</div>
                                    </div>
                                    <div class="album-item album-rank-2-horizontal">
                                        <img src={music.selectedAlbums[1].coverArt} alt={music.selectedAlbums[1].title} class="album-img" style="width: 100%; height: 100%; object-fit: cover; padding: 0;" />
                                        <div class="album-rank">2</div>
                                    </div>
                                    <div class="album-item album-rank-3-horizontal">
                                        <img src={music.selectedAlbums[2].coverArt} alt={music.selectedAlbums[2].title} class="album-img" style="width: 100%; height: 100%; object-fit: cover; padding: 0;" />
                                        <div class="album-rank">3</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Top Right: Top 3 Songs on Album 1 -->
                        <div class="grid-cell songs-cell" style="color: {isColorLight(music.selectedAlbums[0].color) ? '#000' : '#fff'}">
                            <div class="songs-content songs-content-full" style="background-color: {music.selectedAlbums[0].color};">
                                <ul class="songs-list songs-list-spaced">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[0].id) || []).slice(0, 3) as song, i}
                                        <li class="song-item-grid">
                                            <span class="song-number">{i + 1}</span>
                                            <span class="song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Bottom Left: Top 3 Songs on Album 2 -->
                        <div class="grid-cell songs-cell" style="color: {isColorLight(music.selectedAlbums[1].color) ? '#000' : '#fff'}">
                            <div class="songs-content songs-content-full" style="background-color: {music.selectedAlbums[1].color};">
                                <ul class="songs-list songs-list-spaced">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[1].id) || []).slice(0, 3) as song, i}
                                        <li class="song-item-grid">
                                            <span class="song-number">{i + 1}</span>
                                            <span class="song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Bottom Right: Top 3 Songs on Album 3 -->
                        <div class="grid-cell songs-cell" style="color: {isColorLight(music.selectedAlbums[2].color) ? '#000' : '#fff'}">
                            <div class="songs-content songs-content-full" style="background-color: {music.selectedAlbums[2].color};">
                                <ul class="songs-list songs-list-spaced">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[2].id) || []).slice(0, 3) as song, i}
                                        <li class="song-item-grid">
                                            <span class="song-number">{i + 1}</span>
                                            <span class="song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <!-- Grid View Style 2 (Alternative) -->
                <div class="grid-view alt-grid-view" in:fade={{duration: 300}}>
                    <div class="grid-container">
                        <!-- Top Left: Album Names with proportional spacing -->
                        <div class="grid-cell user-message-cell" style="padding: 0;">
                            <!-- Album Names List with proportional spacing -->
                            <div class="album-names-list-grid">
                                <div class="album-name-item album-name-item-1" style="background-color: {music.selectedAlbums[0].color}; color: {isColorLight(music.selectedAlbums[0].color) ? '#000' : '#fff'}">
                                    <span class="album-name-text">{music.selectedAlbums[0].title}</span>
                                </div>
                                <div class="album-name-item album-name-item-2" style="background-color: {music.selectedAlbums[1].color}; color: {isColorLight(music.selectedAlbums[1].color) ? '#000' : '#fff'}">
                                    <span class="album-name-text">{music.selectedAlbums[1].title}</span>
                                </div>
                                <div class="album-name-item album-name-item-3" style="background-color: {music.selectedAlbums[2].color}; color: {isColorLight(music.selectedAlbums[2].color) ? '#000' : '#fff'}">
                                    <span class="album-name-text">{music.selectedAlbums[2].title}</span>
                                </div>
                            </div>
                            
                            <div class="user-message">
                                <p style="color: {isColorLight(music.selectedAlbums[0].color) ? '#000' : '#fff'}">{personalMessage}</p>
                            </div>
                        </div>
                        
                        <!-- Top Right: Top 3 Songs on Album 1 with album as background -->
                        <div class="grid-cell bg-image-cell" style="background-image: url({music.selectedAlbums[0].coverArt})">
                            <div class="songs-overlay songs-overlay-1">
                                <ul class="bg-songs-list">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[0].id) || []).slice(0, 3) as song, i}
                                        <li class="bg-song-item">
                                            <span class="bg-song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Bottom Left: Top 3 Songs on Album 2 with album as background -->
                        <div class="grid-cell bg-image-cell" style="background-image: url({music.selectedAlbums[1].coverArt})">
                            <div class="songs-overlay songs-overlay-2">
                                <ul class="bg-songs-list">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[1].id) || []).slice(0, 3) as song, i}
                                        <li class="bg-song-item">
                                            <span class="bg-song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Bottom Right: Top 3 Songs on Album 3 with album as background -->
                        <div class="grid-cell bg-image-cell" style="background-image: url({music.selectedAlbums[2].coverArt})">
                            <div class="songs-overlay songs-overlay-3">
                                <ul class="bg-songs-list">
                                    {#each (music.selectedSongsByAlbum.get(music.selectedAlbums[2].id) || []).slice(0, 3) as song, i}
                                        <li class="bg-song-item">
                                            <span class="bg-song-name">{song}</span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        {:else if selectedDisplayOption === 3}
            <!-- Free Style Suggestion Form -->
            <div class="free-style-container" in:fade={{duration: 300}}>
                <div class="free-style-form">
                    <h3 class="text-xl font-bold mb-2">Share Your Design Ideas</h3>
                    <p class="mb-4">We'd love to hear your ideas on how to present your top songs and albums! Your suggestions could be implemented in future updates.</p>
                    
                    <div class="mb-4">
                        <textarea 
                            class="w-full p-3 border rounded-lg"
                            rows="5"
                            placeholder="Describe your ideal way to display your favorite Taylor Swift songs and albums..."
                            bind:value={freeStyleSuggestion}
                        ></textarea>
                    </div>
                    
                    <button 
                        class="btn btn-primary"
                        onclick={submitSuggestion}
                        disabled={!freeStyleSuggestion.trim()}
                    >
                        Submit Suggestion
                    </button>
                </div>
                
                {#if pastSuggestions.length > 0}
                    <div class="past-suggestions mt-8">
                        <h4 class="text-lg font-semibold mb-2">Your Past Suggestions</h4>
                        <div class="suggestions-list">
                            {#each pastSuggestions as suggestion, i}
                                <div class="suggestion-card">
                                    <div class="suggestion-number">{i + 1}</div>
                                    <p class="suggestion-text">{suggestion}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
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
    }
    
    .display-options {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: white;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .option-button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: var(--color-secondary-light);
        color: var(--color-text-secondary);
        border-radius: var(--rounded-md);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .option-button.active {
        background-color: #f43f5e;
        color: white;
    }
    
    .option-button:hover:not(.active) {
        background-color: var(--color-secondary-dark);
        color: white;
    }
    
    .album-result {
        position: relative;
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
    
    /* Grid View */
    .grid-view {
        padding: 1rem 0;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1rem;
        aspect-ratio: 1/1;
    }
    
    .grid-cell {
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
        display: flex;
        flex-direction: column;
    }
    
    /* Albums Display (Style 1) */
    .albums-cell {
        padding: 0;
        display: flex;
        flex-direction: column;
    }
    
    .albums-proportional {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
        height: 100%;
    }
    
    .albums-horizontal-container {
        display: flex;
        flex-direction: row;
        gap: 1px;
        flex: 1;
        height: 100%;
    }
    
    .album-item {
        position: relative;
        overflow: hidden;
    }
    
    .album-rank-1-horizontal {
        flex: 0.45;
        position: relative;
        aspect-ratio: 1/1;
        width: 100%;
    }
    
    .album-rank-2-horizontal {
        flex: 0.33;
        position: relative;
        aspect-ratio: 1/1;
    }
    
    .album-rank-3-horizontal {
        flex: 0.22;
        position: relative;
        aspect-ratio: 1/1;
    }
    
    .album-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    
    .album-rank {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        background-color: #ec4899;
        color: white;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.875rem;
    }
    
    /* Songs Display (Style 1) */
    .songs-cell {
        display: flex;
        flex-direction: column;
    }
    
    .songs-content {
        flex: 1;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
    }
    
    .songs-content-full {
        height: 100%;
    }
    
    .songs-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .songs-list-spaced {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
    }
    
    .song-item-grid {
        display: flex;
        align-items: center;
        padding: 0.375rem 0;
        gap: 0.5rem;
    }
    
    .song-number {
        background-color: rgba(255, 255, 255, 0.2);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.875rem;
    }
    
    .song-name {
        font-size: 0.875rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    /* Alt Grid View Styles */
    .alt-grid-view {
        padding: 1rem 0;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .user-message-cell {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
    }
    
    .user-message {
        flex: 1;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 1rem;
        line-height: 1.5;
    }
    
    .bg-image-cell {
        background-size: cover;
        background-position: center;
        position: relative;
    }
    
    .songs-overlay {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 1.5rem;
        border-radius: 0.25rem;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .songs-overlay-1 {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.65);
        padding: 1.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .songs-overlay-2 {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.65);
        padding: 1.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .songs-overlay-3 {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.65);
        padding: 1.5rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .bg-songs-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    
    .bg-song-item {
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.5rem 0;
    }
    
    .songs-overlay-1 .bg-song-item {
        flex: 0.45;
        font-size: 1.7rem;
    }
    
    .songs-overlay-2 .bg-song-item {
        flex: 0.33;
        font-size: 1.4rem;
    }
    
    .songs-overlay-3 .bg-song-item {
        flex: 0.22;
        font-size: 1.2rem;
    }
    
    .bg-song-name {
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    /* Grid Toggle Styles */
    .grid-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: #f3f4f6;
        padding: 0.5rem 1rem;
        border-radius: 999px;
    }
    
    .grid-toggle-label {
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .grid-toggle-label.active {
        color: #ec4899;
        font-weight: 600;
    }
    
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
    }
    
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked + .toggle-slider {
        background-color: #ec4899;
    }
    
    input:checked + .toggle-slider:before {
        transform: translateX(20px);
    }
    
    /* Free Style Form Styles */
    .free-style-container {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .free-style-form {
        background-color: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .past-suggestions {
        padding: 1rem;
    }
    
    .suggestions-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .suggestion-card {
        background-color: white;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 1rem;
    }
    
    .suggestion-number {
        background-color: #ec4899;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .suggestion-text {
        margin: 0;
        line-height: 1.5;
    }
    
    .album-names-list-grid {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin: 0;
        height: 100%;
        flex: 1;
    }
    
    .album-name-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 1rem;
        margin: 0;
    }
    
    .album-name-item-1 {
        flex: 0.45;
        font-size: 1.7rem;
    }
    
    .album-name-item-2 {
        flex: 0.33;
        font-size: 1.4rem;
    }
    
    .album-name-item-3 {
        flex: 0.22;
        font-size: 1.2rem;
    }
    
    .album-name-text {
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
