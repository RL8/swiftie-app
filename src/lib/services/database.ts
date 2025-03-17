import { supabase } from '$lib/supabase/client';
import type { Album, Song, UserFavoriteAlbum, UserFavoriteSong, SelectionsSummary } from '$lib/types/supabase';
import { Tables, Views } from '$lib/types/supabase';

/**
 * Fetches all albums from the database
 */
export const getAlbums = async (): Promise<Album[]> => {
  const { data, error } = await supabase
    .from(Tables.Albums)
    .select('*')
    .order('release_year', { ascending: false });
  
  if (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches a specific album by ID
 */
export const getAlbumById = async (id: number): Promise<Album | null> => {
  const { data, error } = await supabase
    .from(Tables.Albums)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching album ${id}:`, error);
    return null;
  }
  
  return data;
};

/**
 * Fetches songs for a specific album
 */
export const getSongsForAlbum = async (albumId: number): Promise<Song[]> => {
  const { data, error } = await supabase
    .from(Tables.Songs)
    .select('*')
    .eq('album_id', albumId)
    .order('track_number');
  
  if (error) {
    console.error(`Error fetching songs for album ${albumId}:`, error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches all favorite albums for the current user
 */
export const getUserFavoriteAlbums = async (): Promise<UserFavoriteAlbum[]> => {
  const { data, error } = await supabase
    .from(Tables.UserFavoriteAlbums)
    .select(`
      *,
      album:${Tables.Albums}(*)
    `);
  
  if (error) {
    console.error('Error fetching user favorite albums:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches all favorite songs for the current user
 */
export const getUserFavoriteSongs = async (): Promise<UserFavoriteSong[]> => {
  const { data, error } = await supabase
    .from(Tables.UserFavoriteSongs)
    .select(`
      *,
      song:${Tables.Songs}(*)
    `);
  
  if (error) {
    console.error('Error fetching user favorite songs:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Adds an album to the user's favorites, if they haven't reached the limit of 3
 */
export const addFavoriteAlbum = async (albumId: number): Promise<boolean> => {
  // First check if the user already has 3 favorite albums
  const { data: summary } = await supabase
    .from(Views.UserSelectionsSummary)
    .select('user_id, album_count')
    .eq('user_id', supabase.auth.getUser())
    .single();
  
  if (summary && summary.album_count >= 3) {
    console.error('User already has 3 favorite albums');
    return false;
  }
  
  // Add the album to favorites
  const { error } = await supabase
    .from(Tables.UserFavoriteAlbums)
    .insert({ album_id: albumId });
  
  if (error) {
    console.error(`Error adding album ${albumId} to favorites:`, error);
    return false;
  }
  
  return true;
};

/**
 * Removes an album from the user's favorites
 */
export const removeFavoriteAlbum = async (albumId: number): Promise<boolean> => {
  const { error } = await supabase
    .from(Tables.UserFavoriteAlbums)
    .delete()
    .eq('album_id', albumId);
  
  if (error) {
    console.error(`Error removing album ${albumId} from favorites:`, error);
    return false;
  }
  
  return true;
};

/**
 * Adds a song to the user's favorites for a specific album, if they haven't reached the limit of 3 per album
 */
export const addFavoriteSong = async (songId: number, albumId: number): Promise<boolean> => {
  // First check if the user already has 3 favorite songs for this album
  const { data: summary } = await supabase
    .from(Views.UserSelectionsSummary)
    .select('user_id, album_id, song_count')
    .eq('user_id', supabase.auth.getUser())
    .eq('album_id', albumId)
    .single();
  
  if (summary && summary.song_count >= 3) {
    console.error(`User already has 3 favorite songs for album ${albumId}`);
    return false;
  }
  
  // Add the song to favorites
  const { error } = await supabase
    .from(Tables.UserFavoriteSongs)
    .insert({ song_id: songId });
  
  if (error) {
    console.error(`Error adding song ${songId} to favorites:`, error);
    return false;
  }
  
  return true;
};

/**
 * Removes a song from the user's favorites
 */
export const removeFavoriteSong = async (songId: number): Promise<boolean> => {
  const { error } = await supabase
    .from(Tables.UserFavoriteSongs)
    .delete()
    .eq('song_id', songId);
  
  if (error) {
    console.error(`Error removing song ${songId} from favorites:`, error);
    return false;
  }
  
  return true;
};

/**
 * Gets the current user's selection summary (how many albums and songs they've selected)
 */
export const getUserSelectionsSummary = async (): Promise<SelectionsSummary[]> => {
  const { data, error } = await supabase
    .from(Views.UserSelectionsSummary)
    .select('*');
  
  if (error) {
    console.error('Error fetching user selections summary:', error);
    return [];
  }
  
  return data || [];
};
