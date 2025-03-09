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
        if (songs.length !== 3) return; // Maintain 3 songs requirement
        selectedSongsByAlbum.set(albumId, songs);
    }

    function clearSelections() {
        selectedAlbums.length = 0;
        selectedSongsByAlbum.clear();
    }
    
    function quickShare() {
        // Clear existing selections first
        clearSelections();
        
        // Get a copy of albums for random selection
        const allAlbums = [...albums];
        
        // Randomly select 3 unique albums
        for (let i = 0; i < 3; i++) {
            if (allAlbums.length === 0) break;
            
            // Select a random album
            const randomIndex = Math.floor(Math.random() * allAlbums.length);
            const randomAlbum = allAlbums[randomIndex];
            
            // Remove the selected album from the pool to avoid duplicates
            allAlbums.splice(randomIndex, 1);
            
            // Add album to selections
            selectAlbum(randomAlbum);
            
            // Randomly select 3 songs from the album
            const albumSongs = randomAlbum.songs;
            const selectedSongs: string[] = [];
            
            // Create a copy of songs for random selection
            const availableSongs = [...albumSongs];
            
            for (let j = 0; j < 3; j++) {
                if (availableSongs.length === 0) break;
                
                // Select a random song
                const randomSongIndex = Math.floor(Math.random() * availableSongs.length);
                const randomSong = availableSongs[randomSongIndex];
                
                // Remove the selected song from the pool to avoid duplicates
                availableSongs.splice(randomSongIndex, 1);
                
                // Add song to selections
                selectedSongs.push(randomSong);
            }
            
            // Update songs for this album
            updateSelectedSongs(randomAlbum.id, selectedSongs);
        }
        
        return true; // Return success flag
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
        quickShare,
        albums,
    };
}

// Type for the context return value
export type MusicContext = ReturnType<typeof createMusicContext>;
