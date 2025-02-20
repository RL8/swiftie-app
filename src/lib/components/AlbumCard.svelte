<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import type { Album } from '$lib/types';

    const music = getContext<MusicContext>('music');

    interface Props {
        album: Album;
        index: number;
        onClick?: () => void;
        showBorder?: boolean;
    }

    let {
        album,
        index,
        onClick = () => {},
        showBorder = true
    }: Props = $props();

    let isSelected = $derived(music.selectedAlbums.some(a => a.id === album.id));
    let selectionIndex = $derived(music.selectedAlbums.findIndex(a => a.id === album.id) + 1);
</script>

<button
    class="album-card"
    class:selected={isSelected}
    class:show-border={showBorder}
    style="animation-delay: {index * 50}ms"
    onclick={onClick}
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
</button>

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

    .album-card.selected {
        box-shadow: 0 0 0 2px rgb(244, 63, 94);
        transform: translateY(-0.25rem);
    }
</style>
