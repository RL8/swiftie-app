import { supabase } from '$lib/supabase/client';
import type { Album, Song, UserFavoriteAlbum, UserFavoriteSong, SelectionsSummary } from '$lib/types/supabase';
import type { PremiumUser, PaymentRecord, EarlyAdopterCount } from '$lib/types/stripe';
import type { AnonymousSelection } from '$lib/stores/anonymousSelections';
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

/**
 * Gets the premium status for the current user
 */
export const getUserPremiumStatus = async (): Promise<PremiumUser | null> => {
  const { data, error } = await supabase
    .from('premium_users')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching user premium status:', error);
    return null;
  }
  
  return data;
};

/**
 * Creates or updates a user's premium status
 */
export const updateUserPremiumStatus = async (
  isPremium: boolean,
  subscriptionType: 'lifetime' | 'none' = 'lifetime',
  startDate?: Date
): Promise<boolean> => {
  const { error } = await supabase
    .from('premium_users')
    .upsert({
      is_premium: isPremium,
      subscription_type: subscriptionType,
      subscription_start_date: startDate?.toISOString() || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Error updating user premium status:', error);
    return false;
  }
  
  return true;
};

/**
 * Records a new payment in the database
 */
export const recordPayment = async (
  stripePaymentId: string,
  amount: number,
  currency: string = 'usd',
  status: 'succeeded' | 'pending' | 'failed',
  type: 'one_time' | 'subscription'
): Promise<boolean> => {
  const { error } = await supabase
    .from('payment_records')
    .insert({
      stripe_payment_id: stripePaymentId,
      amount,
      currency,
      payment_status: status,
      payment_type: type
    });
  
  if (error) {
    console.error('Error recording payment:', error);
    return false;
  }
  
  return true;
};

/**
 * Gets the current early adopter count
 */
export const getEarlyAdopterCount = async (): Promise<EarlyAdopterCount | null> => {
  const { data, error } = await supabase
    .from('early_adopter_count')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Error fetching early adopter count:', error);
    return null;
  }
  
  return data;
};

/**
 * Checks if early adopter slots are available
 */
export const checkEarlyAdopterAvailability = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('check_early_adopter_availability');
  
  if (error) {
    console.error('Error checking early adopter availability:', error);
    return false;
  }
  
  return !!data;
};

/**
 * Increments the early adopter count when a new early adopter signs up
 * Returns the new count, or -1 if the maximum has been reached
 */
export const incrementEarlyAdopterCount = async (): Promise<number> => {
  const { data, error } = await supabase
    .rpc('increment_early_adopter_count');
  
  if (error) {
    console.error('Error incrementing early adopter count:', error);
    return -1;
  }
  
  return data;
};

/**
 * Transfer anonymous selections to a user's account in the database
 * @param userId The user ID to associate the selections with
 * @param selections Array of anonymous selections to transfer
 * @returns Object with success status and error message (if failed)
 */
export const transferAnonymousSelections = async (
  userId: string,
  selections: AnonymousSelection[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!selections || selections.length === 0) {
      return { success: true }; // No selections to transfer
    }

    // Group selections by type
    const albumSelections = selections.filter(s => s.type === 'album');
    const songSelections = selections.filter(s => s.type === 'song');
    const artistSelections = selections.filter(s => s.type === 'artist');
    const swiftivitySelections = selections.filter(s => s.type === 'swiftivity');

    // Process album selections
    if (albumSelections.length > 0) {
      const { error: albumError } = await supabase.from('user_album_selections').insert(
        albumSelections.map(selection => ({
          user_id: userId,
          album_id: selection.id,
          selected_at: selection.selectedAt
        }))
      );

      if (albumError) {
        console.error('Error transferring album selections:', albumError);
        return { success: false, error: albumError.message };
      }
    }

    // Process song selections
    if (songSelections.length > 0) {
      const { error: songError } = await supabase.from('user_song_selections').insert(
        songSelections.map(selection => ({
          user_id: userId,
          song_id: selection.id,
          selected_at: selection.selectedAt
        }))
      );

      if (songError) {
        console.error('Error transferring song selections:', songError);
        return { success: false, error: songError.message };
      }
    }

    // Process artist selections
    if (artistSelections.length > 0) {
      const { error: artistError } = await supabase.from('user_artist_selections').insert(
        artistSelections.map(selection => ({
          user_id: userId,
          artist_id: selection.id,
          selected_at: selection.selectedAt
        }))
      );

      if (artistError) {
        console.error('Error transferring artist selections:', artistError);
        return { success: false, error: artistError.message };
      }
    }

    // Process swiftivity selections
    if (swiftivitySelections.length > 0) {
      const { error: swiftivityError } = await supabase.from('user_swiftivity_selections').insert(
        swiftivitySelections.map(selection => ({
          user_id: userId,
          swiftivity_id: selection.id,
          selected_at: selection.selectedAt
        }))
      );

      if (swiftivityError) {
        console.error('Error transferring swiftivity selections:', swiftivityError);
        return { success: false, error: swiftivityError.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in transferAnonymousSelections:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error transferring selections' 
    };
  }
};

/**
 * Get user selections by type
 * @param userId The user ID to get selections for
 * @param type The type of selections to get (album, song, artist, swiftivity)
 * @returns Array of selection IDs
 */
export const getUserSelectionsByType = async (
  userId: string,
  type: 'album' | 'song' | 'artist' | 'swiftivity'
): Promise<string[]> => {
  try {
    let tableName = '';
    let idColumn = '';
    
    switch (type) {
      case 'album':
        tableName = 'user_album_selections';
        idColumn = 'album_id';
        break;
      case 'song':
        tableName = 'user_song_selections';
        idColumn = 'song_id';
        break;
      case 'artist':
        tableName = 'user_artist_selections';
        idColumn = 'artist_id';
        break;
      case 'swiftivity':
        tableName = 'user_swiftivity_selections';
        idColumn = 'swiftivity_id';
        break;
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select(idColumn)
      .eq('user_id', userId);
    
    if (error) {
      console.error(`Error getting user ${type} selections:`, error);
      return [];
    }
    
    return data.map(item => item[idColumn]);
  } catch (error) {
    console.error(`Error in getUserSelectionsByType for ${type}:`, error);
    return [];
  }
};
