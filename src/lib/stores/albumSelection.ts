import { writable } from 'svelte/store';
import type { Album } from '$lib/types/album';

export const selectedAlbums = writable<Album[]>([]);

export const isSelectionComplete = writable<boolean>(false);

export function addAlbum(album: Album) {
    selectedAlbums.update(albums => {
        if (albums.length < 3 && !albums.find(a => a.id === album.id)) {
            const newAlbums = [...albums, album];
            isSelectionComplete.set(newAlbums.length === 3);
            return newAlbums;
        }
        return albums;
    });
}

export function removeAlbum(albumId: string) {
    selectedAlbums.update(albums => {
        const newAlbums = albums.filter(a => a.id !== albumId);
        isSelectionComplete.set(newAlbums.length === 3);
        return newAlbums;
    });
}

export function clearSelection() {
    selectedAlbums.set([]);
    isSelectionComplete.set(false);
}
