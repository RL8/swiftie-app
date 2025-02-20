<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import confetti from 'canvas-confetti';
    import { fade } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';

    const music = getContext<() => MusicContext>('music')();

    function handleStartOver() {
        music.clearSelections();
        goto(`${base}/albums`);
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

    onMount(() => {
        mounted = true;
        
        // Start animation sequence after a short delay
        setTimeout(() => {
            showAlbum1 = true;
            
            setTimeout(() => {
                showAlbum2 = true;
                
                setTimeout(() => {
                    showAlbum3 = true;
                    // Trigger confetti when all albums appear
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#FFB6C1', '#FF69B4', '#FF1493'],
                        disableForReducedMotion: true
                    });
                }, 600);
            }, 600);
        }, 300);
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            
            title="Your Top 3"
            subtitle="Your favorite albums and songs" />
    {/snippet}

    <div class="flex-1 p-6">
        {#if mounted}
            <div class="results-container">
                {#if showAlbum1}
                    <div class="album-result">
                        <div class="heart-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            <span class="heart-number">1</span>
                        </div>
                        <div class="album-container" transition:fade>
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
                    <div class="album-result">
                        <div class="heart-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            <span class="heart-number">2</span>
                        </div>
                        <div class="album-container" transition:fade>
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
                    <div class="album-result">
                        <div class="heart-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            <span class="heart-number">3</span>
                        </div>
                        <div class="album-container" transition:fade>
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
    </div>

    {#snippet footer()}
        <Footer variant="button" >
            <Button 
                variant="primary"
                on:click={handleStartOver}
            >
                Start Over
            </Button>
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .results-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 32rem;
        margin: 0 auto;
    }

    .album-container {
        background: white;
        border-radius: 1rem;
        padding: 0.75rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.15s;
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
        gap: 0.25rem;
        margin-bottom: 0.125rem;
    }

    .song-rank {
        font-size: 0.8rem;
        min-width: 1rem;
        text-align: right;
    }

    .song-item {
        padding: 0.2rem 0.375rem;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        transition: transform 0.15s;
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
        z-index: 30;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: heartbeat 2s ease-in-out infinite;
    }

    .heart-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        color: rgb(244, 63, 94);
    }

    .heart-number {
        position: relative;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        z-index: 11;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }

    .album-result {
        position: relative;
    }
</style>
