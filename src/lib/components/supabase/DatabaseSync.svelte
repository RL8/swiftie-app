<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { browser } from '$app/environment';
    import { saveUserSelections, mapToRecord } from '$lib/utils/localStorageUtils';
    
    // Get the music context function but don't invoke it immediately
    const getMusicContext = getContext<() => MusicContext>('music');
    
    // Setup effects to handle music context changes and save to localStorage
    function setupLocalStorageSyncing() {
        // Get the music context
        const music = getMusicContext();
        
        // Watch for changes to the music context and save to localStorage
        $effect(() => {
            if (browser) {
                // Save selections whenever they change
                saveUserSelections({
                    selectedAlbums: music.selectedAlbums,
                    selectedSongsByAlbum: mapToRecord(music.selectedSongsByAlbum),
                    userName: music.userName,
                    lastUpdated: new Date().toISOString()
                });
            }
        });
    }
    
    // Initialize the component
    onMount(() => {
        // Setup localStorage syncing
        setupLocalStorageSyncing();
    });
</script>

<!-- This is a utility component with no UI -->
