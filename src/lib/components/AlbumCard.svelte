<script lang="ts">
    import type { Album } from '$lib/types/album';
    import { selectedAlbums } from '$lib/stores/albumSelection';
    
    let { album, index } = $props<{
        album: Album;
        index: number;
    }>();
    
    const isSelected = $derived($selectedAlbums.some(a => a.id === album.id));
    const selectionIndex = $derived($selectedAlbums.findIndex(a => a.id === album.id) + 1);
</script>

<div
    class="album-card"
    style="animation-delay: {index * 50}ms"
    on:click
    on:keydown={(e) => e.key === 'Enter' && e.currentTarget.click()}
    role="button"
    tabindex="0"
>
    <div class="album-content">
        <img
            src={album.coverArt}
            alt={album.title}
            class="w-full h-full object-cover"
        />
        
        {#if isSelected}
            <div class="selection-overlay">
                <span class="text-4xl font-bold text-white">{selectionIndex}</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .album-card {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .album-card:hover {
        transform: translateY(-0.25rem);
    }

    .album-content {
        position: relative;
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .selection-overlay {
        position: absolute;
        inset: 0;
        background: rgba(244, 63, 94, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.album-card[data-selected="true"]) .album-content {
        box-shadow: 0 0 0 2px rgb(244, 63, 94);
        transform: translateY(-0.25rem);
    }
</style>
