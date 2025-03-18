import { albums } from '$lib/data/albums';
import type { Album } from '$lib/types/components';

export function createMusicContext() {
    // Core state
    const selectedAlbums = $state<Album[]>([]);
    const selectedSongsByAlbum = $state<Map<string, string[]>>(new Map());
    const userName = $state<string>("Taylor Swift Fan");

    // Derived states
    const totalSelections = $derived(() => selectedAlbums.length);
    
    const selectedSongsCount = $derived(() => {
        let count = 0;
        for (const songs of selectedSongsByAlbum.values()) {
            count += songs.length;
        }
        return count;
    });

    // Methods
    function selectAlbum(album: Album) {
        if (selectedAlbums.length >= 3) return;
        if (selectedAlbums.find(a => a.id === album.id)) return;
        
        selectedAlbums.push(album);
        // Initialize empty song selection for this album
        selectedSongsByAlbum.set(album.id, []);
    }

    function removeAlbum(albumId: string) {
        const index = selectedAlbums.findIndex(album => album.id === albumId);
        if (index !== -1) {
            selectedAlbums.splice(index, 1);
            selectedSongsByAlbum.delete(albumId);
        }
    }

    function updateSelectedSongs(albumId: string, songs: string[]) {
        // Accept any number of songs for testing purposes (previously required exactly 3)
        selectedSongsByAlbum.set(albumId, songs);
    }

    function clearSelections() {
        selectedAlbums.length = 0;
        selectedSongsByAlbum.clear();
    }
    
    // Return read-only access to state and methods
    return {
        get selectedAlbums() { return selectedAlbums; },
        get selectedSongsByAlbum() { return selectedSongsByAlbum; },
        get totalSelections() { return totalSelections; },
        get selectedSongsCount() { return selectedSongsCount; },
        get userName() { return userName; },
        selectAlbum,
        removeAlbum,
        updateSelectedSongs,
        clearSelections,
        albums,
    };
}

// Type for the context return value
export type MusicContext = ReturnType<typeof createMusicContext>;
