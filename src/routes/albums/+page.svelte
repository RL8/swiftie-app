<script lang="ts">
    import { albums } from '$lib/data/albums';
    import { selectedAlbums, addAlbum, removeAlbum, isSelectionComplete } from '$lib/stores/albumSelection';
    import { goto } from '$app/navigation';
    import PageHeader from '$lib/components/PageHeader.svelte';
    import Button from '$lib/components/Button.svelte';
    
    function handleAlbumClick(album: typeof albums[0]) {
        if ($selectedAlbums.some(a => a.id === album.id)) {
            removeAlbum(album.id);
        } else if ($selectedAlbums.length < 3) {
            addAlbum(album);
        }
    }
    
    function handleContinue() {
        if ($isSelectionComplete) {
            goto('/albums/confirm');
        }
    }
    
    // Create a 4x3 grid by padding the albums array if needed
    const gridAlbums = $derived([
        ...albums,
        ...Array(Math.max(0, 12 - albums.length)).fill(null)
    ]);
</script>

<PageHeader 
    title="Choose Your Top 3" 
    subtitle="Select your favorite Taylor Swift albums"
    headerSlot={true}
>
    <div slot="header" class="progress-bar">
        <div class="progress-segments">
            {#each Array(3) as _, i}
                <div class="segment" class:filled={i < $selectedAlbums.length}>
                    {#if i < $selectedAlbums.length}
                        <div class="segment-number">{i + 1}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</PageHeader>

<main class="flex-1 overflow-y-auto p-4">
    <div class="album-grid">
        {#each gridAlbums as album, i}
            {#if album}
                <button
                    class="vinyl-container"
                    class:selected={$selectedAlbums.some(a => a.id === album.id)}
                    on:click={() => handleAlbumClick(album)}
                >
                    <div class="vinyl">
                        <img
                            src={album.coverArt}
                            alt={album.title}
                            class="vinyl-art"
                        />
                        <div class="vinyl-grooves" />
                        <div class="vinyl-center" />
                        {#if $selectedAlbums.some(a => a.id === album.id)}
                            <div class="rank-badge">
                                {$selectedAlbums.findIndex(a => a.id === album.id) + 1}
                            </div>
                        {/if}
                    </div>
                </button>
            {:else}
                <div class="placeholder" />
            {/if}
        {/each}
    </div>
</main>

<footer class="p-4 border-t border-rose-100">
    <div class="max-w-md mx-auto">
        <Button 
            variant="primary" 
            shimmer={$isSelectionComplete}
            on:click={handleContinue}
            disabled={!$isSelectionComplete}
        >
            Continue to Songs
        </Button>
    </div>
</footer>

<style>
    .progress-bar {
        @apply mt-2;
    }

    .progress-segments {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: rgb(254, 205, 211);
        height: 2rem;
        border-radius: 1rem;
        overflow: hidden;
    }

    .segment {
        background: rgb(255, 241, 242);
        position: relative;
        transition: background-color 0.3s ease;
    }

    .segment.filled {
        background: rgb(244, 63, 94);
    }

    .segment-number {
        @apply absolute inset-0 flex items-center justify-center text-white font-bold;
        animation: popIn 0.3s ease-out forwards;
    }

    .album-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 0.75rem;
    }

    .placeholder {
        aspect-ratio: 1;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
    }

    .vinyl-container {
        aspect-ratio: 1;
        position: relative;
        transition: transform 0.2s ease;
    }

    .vinyl-container:active {
        transform: scale(0.95);
    }

    .vinyl {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #000;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        animation: subtleRotate 4s ease-in-out infinite;
    }

    @keyframes subtleRotate {
        0% {
            transform: rotate(-2deg);
        }
        50% {
            transform: rotate(2deg);
        }
        100% {
            transform: rotate(-2deg);
        }
    }

    .vinyl-container.selected .vinyl {
        transform: scale(1.05);
        animation: selectedRotate 4s ease-in-out infinite;
    }

    @keyframes selectedRotate {
        0% {
            transform: scale(1.05) rotate(-3deg);
        }
        50% {
            transform: scale(1.05) rotate(3deg);
        }
        100% {
            transform: scale(1.05) rotate(-3deg);
        }
    }

    .vinyl::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%
        );
        z-index: 2;
    }

    .vinyl-container.selected .vinyl::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 3;
    }

    .vinyl-art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .vinyl-grooves {
        position: absolute;
        inset: 0;
        background: repeating-radial-gradient(
            circle at center,
            transparent 0,
            transparent 4px,
            rgba(255, 255, 255, 0.03) 4.5px,
            rgba(0, 0, 0, 0.1) 5px
        );
        mix-blend-mode: overlay;
        z-index: 1;
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
        background: #111;
        border-radius: 50%;
        box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.2);
    }

    .rank-badge {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2.5rem;
        height: 2.5rem;
        background: rgb(244, 63, 94);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.125rem;
        box-shadow: 
            0 2px 8px rgba(244, 63, 94, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }

    @keyframes popIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
