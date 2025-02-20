<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';
    
    const music = getContext<() => MusicContext>('music')();
    
    function handleAlbumClick(album: typeof music.albums[0]) {
        if (music.selectedAlbums.some(a => a.id === album.id)) {
            music.removeAlbum(album.id);
        } else if (music.selectedAlbums.length < 3) {
            music.selectAlbum(album);
        }
    }
    
    function handleContinue() {
        if (music.selectedAlbums.length === 3) {
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
        progress={music.selectedAlbums.length}
        maxProgress={3} />

    <main slot="main" class="flex flex-col items-center justify-center h-full p-4">
        <div class="album-grid">
            {#each music.albums as album}
                {@const isSelected = music.selectedAlbums.some(a => a.id === album.id)}
                {@const selectionIndex = music.selectedAlbums.findIndex(a => a.id === album.id)}
                <div class="album-wrapper">
                    <VinylRecord
                        coverArt={album.coverArt}
                        title={album.title}
                        selected={isSelected}
                        selectionNumber={isSelected ? selectionIndex + 1 : null}
                        badgePosition="image"
                        showSelectionOverlay={true}
                        showGrooves={true}
                        on:click={() => handleAlbumClick(album)}
                    />
                </div>
            {/each}
        </div>
    </main>

    <Footer variant="button" slot="footer">
        <Button 
            variant="primary"
            disabled={music.selectedAlbums.length < 3}
            on:click={handleContinue}
        >
            Continue
        </Button>
    </Footer>
</StandardLayout>

<style>
    .album-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        width: 100%;
        max-width: 24rem;
        min-width: 16rem;
        margin: 0 auto;
    }

    .album-wrapper {
        width: 100%;
        height: 100%;
    }
</style>
