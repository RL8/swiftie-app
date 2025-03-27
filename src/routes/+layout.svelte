<script lang="ts">
    import '../app.css';
    import { navigating, page } from '$app/stores';
    import { browser } from '$app/environment';
    import { onMount, setContext } from 'svelte';
    import { createMusicContext } from '$lib/context/music.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import { loadUserSelections } from '$lib/utils/localStorageUtils';
    
    // Create and set the music context for all users
    const musicContext = $state(createMusicContext());
    
    // Set context
    $effect(() => {
        setContext('music', () => musicContext);
    });
    
    // Make data available to all child components
    $effect(() => {
        setContext('data', $page.data);
    });
    
    // Initialize music context from localStorage on mount
    onMount(() => {
        if (browser) {
            // Load user selections from localStorage
            const userSelections = loadUserSelections();
            
            // Initialize the music context with stored data
            if (userSelections.selectedAlbums.length > 0) {
                // Add each album to the context
                userSelections.selectedAlbums.forEach(album => {
                    musicContext.selectAlbum(album);
                });
                
                // Add songs for each album
                Object.entries(userSelections.selectedSongsByAlbum).forEach(([albumId, songs]) => {
                    musicContext.updateSelectedSongs(albumId, songs);
                });
            }
        }
    });
</script>

<StandardLayout>
    <div class="flex flex-col min-h-screen">
        <slot />
    </div>
</StandardLayout>

<style>
    :global(html) {
        background-color: rgb(226, 232, 240);
        height: 100%;
    }

    :global(body) {
        height: 100%;
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>