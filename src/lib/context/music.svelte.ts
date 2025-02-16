import { albums } from '$lib/data/albums';
import type { Album } from '$lib/types/components';

export function createMusicContext() {
    // Core state
    const selectedAlbums = $state<Album[]>([]);
    const selectedSongsByAlbum = $state<Map<string, string[]>>(new Map());

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
        
        // Select 3 random songs by default
        const shuffledSongs = [...album.songs].sort(() => Math.random() - 0.5);
        selectedSongsByAlbum.set(album.id, shuffledSongs.slice(0, 3));
    }

    function removeAlbum(albumId: string) {
        const index = selectedAlbums.findIndex(album => album.id === albumId);
        if (index !== -1) {
            selectedAlbums.splice(index, 1);
            selectedSongsByAlbum.delete(albumId);
        }
    }

    function updateSelectedSongs(albumId: string, songs: string[]) {
        if (songs.length !== 3) return; // Maintain 3 songs requirement
        selectedSongsByAlbum.set(albumId, songs);
    }

    function clearSelections() {
        selectedAlbums.length = 0;
        selectedSongsByAlbum.clear();
    }

    // Return read-only access to state and methods
    return {
        get albums() { return albums; },
        get selectedAlbums() { return selectedAlbums; },
        get selectedSongsByAlbum() { return selectedSongsByAlbum; },
        get totalSelections() { return totalSelections; },
        get selectedSongsCount() { return selectedSongsCount; },
        selectAlbum,
        removeAlbum,
        updateSelectedSongs,
        clearSelections
    };
}

// Type for the context return value
export type MusicContext = ReturnType<typeof createMusicContext>;
