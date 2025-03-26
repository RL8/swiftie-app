<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';
    import StepNavigation from '$lib/components/navigation/StepNavigation.svelte';
    import { anonymousSelections } from '$lib/stores/anonymousSelections';
    
    const music = getContext<() => MusicContext>('music')();
    
    // Track if the user is authenticated
    const isAuthenticated = $page.data.authenticatedSession !== undefined;
    
    function handleAlbumClick(album: typeof music.albums[0]) {
        if (music.selectedAlbums.some(a => a.id === album.id)) {
            music.removeAlbum(album.id);
            
            // If not authenticated, also remove from anonymous selections
            if (!isAuthenticated) {
                anonymousSelections.removeSelection(album.id, 'album');
            }
        } else if (music.selectedAlbums.length < 3) {
            music.selectAlbum(album);
            
            // If not authenticated, save to anonymous selections
            if (!isAuthenticated) {
                anonymousSelections.addSelection({
                    id: album.id,
                    type: 'album',
                    name: album.title,
                    imageUrl: album.coverArt
                });
            }
        }
    }
    
    function handleContinue() {
        if (music.selectedAlbums.length === 3) {
            goto(`${base}/albums/confirm`);
        }
    }

    // Automatic selection for Quick Share
    function performQuickShareSelection() {
        // Clear any previous selections
        music.clearSelections();
        
        // If not authenticated, also clear anonymous selections
        if (!isAuthenticated) {
            anonymousSelections.clearSelections();
        }
        
        // Shuffle albums and select 3 random ones
        const shuffledAlbums = [...music.albums].sort(() => Math.random() - 0.5).slice(0, 3);
        
        // Select each album
        for (const album of shuffledAlbums) {
            music.selectAlbum(album);
            
            // If not authenticated, save to anonymous selections
            if (!isAuthenticated) {
                anonymousSelections.addSelection({
                    id: album.id,
                    type: 'album',
                    name: album.title,
                    imageUrl: album.coverArt
                });
            }
        }
        
        // Navigate to confirmation page
        goto(`${base}/albums/confirm?quick-share=true`);
    }
    
    // Check if automatic selection should be performed
    onMount(() => {
        const isQuickShare = $page.url.searchParams.get('quick-share') === 'true';
        if (isQuickShare) {
            performQuickShareSelection();
            return;
        }
        
        // If not authenticated, load anonymous selections
        if (!isAuthenticated) {
            const savedAlbumSelections = anonymousSelections.getSelectionsByType('album');
            
            // Clear existing selections first
            music.clearSelections();
            
            // Add each saved album to the music context selections
            // Only add up to 3 albums
            const albumsToAdd = savedAlbumSelections.slice(0, 3);
            
            for (const savedAlbum of albumsToAdd) {
                const albumData = music.albums.find(a => a.id === savedAlbum.id);
                if (albumData) {
                    music.selectAlbum(albumData);
                }
            }
        }
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            variant="progress"
            title="Pick Your Top 3"
            subtitle="Choose your favorite Taylor Swift albums"
            progress={music.selectedAlbums.length}
            maxProgress={3} />
    {/snippet}

    {#snippet main()}
        <main  class="flex flex-col items-center justify-center h-full p-4">
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
    {/snippet}

    {#snippet footer()}
        <Footer variant="button" >
            <StepNavigation
                backLabel="Return to Home"
                backPath="/"
                forwardLabel="Continue with {music.selectedAlbums.length} Albums"
                forwardPath="/albums/confirm"
                disableForward={music.selectedAlbums.length < 3}
                onForward={handleContinue}
                currentStep={1}
                totalSteps={4}
                showProgressBar={true}
            />
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .album-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        width: 100%;
        max-width: 100%;
        min-width: 16rem;
        margin: 0 auto;
    }

    .album-wrapper {
        width: 100%;
        height: 100%;
    }
</style>
