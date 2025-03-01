<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import { fade } from 'svelte/transition';
    import { tapAnimation } from '$lib/actions/tapAnimation';
    
    const music = getContext<() => MusicContext>('music')();
    let currentSongSelections = $state<string[]>([]);
    let currentAlbumIndex = $state(0);
    
    // Get the current album based on index
    const currentAlbum = $derived(music.selectedAlbums[currentAlbumIndex]);
    
    function handleSongSelect(songTitle: string) {
        const songIndex = currentSongSelections.indexOf(songTitle);
        if (songIndex !== -1) {
            currentSongSelections = currentSongSelections.filter(s => s !== songTitle);
        } else if (currentSongSelections.length < 3) {
            currentSongSelections = [...currentSongSelections, songTitle];
        }
    }
    
    function handleBack() {
        if (currentAlbumIndex > 0) {
            currentAlbumIndex--;
            currentSongSelections = music.selectedSongsByAlbum.get(music.selectedAlbums[currentAlbumIndex].id) || [];
        } else {
            goto(`${base}/albums/confirm`);
        }
    }
    
    function handleContinue() {
        if (currentSongSelections.length === 3) {
            // Store the current album's song selections
            music.updateSelectedSongs(currentAlbum.id, currentSongSelections);
            
            if (currentAlbumIndex < 2) {
                currentAlbumIndex++;
                currentSongSelections = music.selectedSongsByAlbum.get(music.selectedAlbums[currentAlbumIndex].id) || [];
            } else {
                goto(`${base}/albums/results`);
            }
        }
    }
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            variant="progress"
            title="Now, select your 3 top bangers from {currentAlbum?.title}"
            subtitle="Choose your favorite songs"
            progress={currentSongSelections.length}
            maxProgress={3}>
            
            <!-- Selected Albums Stack in Header -->
            {#snippet left()}
                <div class="albums-stack" >
                    {#each music.selectedAlbums as album, i}
                        <div 
                            class="selected-album"
                            class:active={i === currentAlbumIndex}
                            style="transform: translate({i * -4}px, {i * -4}px)">
                            <div class="vinyl-mini">
                                <img
                                    src={album.coverArt}
                                    alt={album.title}
                                    class="vinyl-art-mini"
                                />
                                <div class="vinyl-grooves-mini"></div>
                                <div class="vinyl-center-mini"></div>
                                <div class="heart-badge-mini">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                    <span class="heart-number-mini">{i + 1}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/snippet}
        </Header>
    {/snippet}

    {#snippet main()}
        <main class="flex flex-col items-center justify-start h-full p-4">
            <!-- Songs List -->
            <div class="songs-container" in:fade={{duration: 300}}>
                {#each currentAlbum?.songs || [] as song, i}
                    <button
                        class="song-card"
                        class:selected={currentSongSelections.includes(song)}
                        onclick={() => handleSongSelect(song)}
                        use:tapAnimation
                    >
                        <div class="song-info">
                            <span class="song-number" style="text-align: right;">{i + 1}.</span>
                            <span class="song-title">{song}</span>
                        </div>
                        {#if currentSongSelections.includes(song)}
                            <div class="heart-badge-song">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                <span class="heart-number-song">{currentSongSelections.indexOf(song) + 1}</span>
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>
        </main>
    {/snippet}

    {#snippet footer()}
        <Footer variant="nav" >
            <Button variant="secondary" on:click={handleBack}>
                {currentAlbumIndex > 0 ? 'Previous Album' : 'Back'}
            </Button>
            <Button 
                variant="primary"
                disabled={currentSongSelections.length < 3}
                on:click={handleContinue}
            >
                {currentAlbumIndex < 2 ? 'Next Album' : 'See Results'}
            </Button>
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .albums-stack {
        position: relative;
        width: 4rem;
        height: 4rem;
        margin-right: 1rem;
    }

    .selected-album {
        position: absolute;
        transition: all var(--duration-fast, 0.3s) var(--timing-function, ease-out);
    }

    .selected-album.active {
        z-index: var(--z-overlay, 3);
    }

    .vinyl-mini {
        width: 4rem;
        height: 4rem;
        position: relative;
        border-radius: 50%;
        background: #000;
        overflow: hidden;
        box-shadow: var(--shadow-sm, 0 2px 4px) rgba(0, 0, 0, 0.2);
    }

    .vinyl-art-mini {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .vinyl-grooves-mini {
        position: absolute;
        inset: 0;
        background: repeating-radial-gradient(
            circle at center,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 2.5px,
            rgba(0, 0, 0, 0.15) 3px
        );
        mix-blend-mode: overlay;
        z-index: 2;
        pointer-events: none;
        opacity: 0.85;
    }

    .vinyl-center-mini {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20%;
        height: 20%;
        background: #000;
        border-radius: 50%;
        z-index: 3;
    }

    .heart-badge-mini {
        position: absolute;
        top: -0.3rem;
        left: -0.3rem;
        width: 1.8rem;
        height: 1.8rem;
        color: var(--color-primary, rgb(244, 63, 94));
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .heart-number-mini {
        position: absolute;
        color: var(--text-light, white);
        font-size: 0.8rem;
        font-weight: bold;
    }

    .songs-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-1, 0.2rem);
        padding: var(--space-1, 0.2rem);
        width: 100%;
        max-width: var(--container-max-width);
    }

    .song-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md, 0.5rem);
        transition: all var(--duration-fast, 0.2s) var(--timing-function, ease-out);
        backdrop-filter: var(--blur-md, blur(8px));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1),
                   0 1px 2px rgba(0, 0, 0, 0.15);
        text-align: left;
        width: 100%;
    }

    .song-card:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .song-card.selected {
        background: var(--color-primary-alpha, rgba(244, 63, 94, 0.2));
    }

    .song-info {
        display: flex;
        align-items: center;
        gap: var(--space-1, 0.2rem);
        flex: 1;
    }

    .song-number {
        color: var(--text-secondary, #9f1239);
        font-size: 0.8rem;
        min-width: 1.2rem;
        text-align: right;
    }

    .song-title {
        color: var(--text-primary, #881337);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .heart-badge-song {
        width: 1.2rem;
        height: 1.2rem;
        color: var(--color-primary, rgb(244, 63, 94));
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .heart-number-song {
        position: absolute;
        color: var(--text-light, white);
        font-size: 0.7rem;
        font-weight: bold;
    }
</style>