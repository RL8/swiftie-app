import { writable } from 'svelte/store';
import type { Album } from '$lib/types/components';

export const selectedAlbums = writable<Album[]>([]);

export function addAlbum(album: Album) {
    selectedAlbums.update(albums => {
        if (albums.length >= 3) return albums;
        if (albums.find(a => a.id === album.id)) return albums;
        return [...albums, album];
    });
}

export function removeAlbum(albumId: string) {
    selectedAlbums.update(albums => 
        albums.filter(album => album.id !== albumId)
    );
}

export function clearAlbums() {
    selectedAlbums.set([]);
}
