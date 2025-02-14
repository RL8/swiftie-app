<script lang="ts">
    import { albums } from '$lib/data/albums';
    import { selectedAlbums, addAlbum, removeAlbum } from '$lib/stores/albums';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    
    function handleAlbumClick(album: typeof albums[0]) {
        if ($selectedAlbums.some(a => a.id === album.id)) {
            removeAlbum(album.id);
        } else if ($selectedAlbums.length < 3) {
            addAlbum(album);
        }
    }
    
    function handleContinue() {
        if ($selectedAlbums.length === 3) {
            goto(`${base}/albums/confirm`);
        }
    }
</script>

<StandardLayout>
    <Header 
        slot="header"
        variant="progress"
        title="Pick Your Top 3"
        subtitle="Choose your favorite Taylor Swift albums"
        progress={$selectedAlbums.length}
        maxProgress={3} />

    <main slot="main" class="flex flex-col items-center justify-center h-full p-4">
        <div class="album-grid">
            {#each albums as album, i}
                <div
                    class="vinyl-container"
                    class:selected={$selectedAlbums.some(a => a.id === album.id)}
                    on:click={() => handleAlbumClick(album)}
                    style={`--random-rotation: ${Math.random() * 5 - 2.5};`}
                >
                    {#if $selectedAlbums.some(a => a.id === album.id)}
                        <div class="heart-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                            <span class="heart-number">
                                {$selectedAlbums.findIndex(a => a.id === album.id) + 1}
                            </span>
                        </div>
                    {/if}
                    <div class="vinyl">
                        <img
                            src={album.coverArt}
                            alt={album.title}
                            class="vinyl-art"
                        />
                        <div class="vinyl-grooves"></div>
                        <div class="vinyl-center"></div>
                        {#if $selectedAlbums.some(a => a.id === album.id)}
                            <div class="selection-overlay"></div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </main>

    <Footer variant="button" slot="footer">
        <Button 
            variant="primary"
            disabled={$selectedAlbums.length < 3}
            on:click={() => goto(`${base}/albums/confirm`)}
        >
            Continue
        </Button>
    </Footer>
</StandardLayout>

<style>
    .album-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 0.5rem;
        width: 100%;
        max-width: 24rem;
        margin: 0 auto;
    }

    .vinyl-container {
        aspect-ratio: 1;
        position: relative;
        transform: rotate(calc(var(--random-rotation, 0) * 1deg));
        animation: subtleRotate 2s ease-in-out infinite;
        transition: all 0.3s ease-out;
    }

    .vinyl-container.selected {
        z-index: 20;
        animation: fullRotate 8s linear infinite;
    }

    @keyframes fullRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes subtleRotate {
        0% { transform: rotate(calc(var(--random-rotation, 0) * 1deg)); }
        50% { transform: rotate(calc((var(--random-rotation, 0) + 2) * 1deg)); }
        100% { transform: rotate(calc(var(--random-rotation, 0) * 1deg)); }
    }

    .vinyl {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #000;
        overflow: hidden;
        box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .vinyl-art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .vinyl-grooves {
        position: absolute;
        inset: 0;
        background: repeating-radial-gradient(
            circle at center,
            transparent 0,
            transparent 3px,
            rgba(255, 255, 255, 0.05) 3.5px,
            rgba(0, 0, 0, 0.15) 4px
        );
        mix-blend-mode: overlay;
        z-index: 2;
        pointer-events: none;
        opacity: 0.85;
    }

    .vinyl-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20%;
        height: 20%;
        background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.9) 50%,
            #000 100%
        );
        border-radius: 50%;
        z-index: 4;
        box-shadow: 
            0 0 0 2px rgba(255, 255, 255, 0.1),
            inset 0 0 0 2px rgba(0, 0, 0, 0.4);
    }

    .vinyl-center::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
        height: 15%;
        background: rgb(226, 232, 240);
        border-radius: 50%;
        box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.2);
    }

    .selection-overlay {
        position: absolute;
        inset: 0;
        background: rgba(244, 63, 94, 0.2);
        border-radius: 50%;
        z-index: 3;
        box-shadow: inset 0 0 20px rgba(244, 63, 94, 0.4);
    }

    .heart-badge {
        position: absolute;
        top: -0.4rem;
        left: -0.4rem;
        width: 3.6rem;
        height: 3.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 30;
        color: rgb(244, 63, 94);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        pointer-events: none;
        animation: noRotate 8s linear infinite reverse;
    }

    @keyframes noRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .vinyl-container.selected .heart-badge {
        animation: noRotate 8s linear infinite reverse;
    }

    .heart-icon {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .heart-number {
        position: relative;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        z-index: 11;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
</style>
