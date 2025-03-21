// Type definitions that match our Supabase database schema

export interface Album {
  id: number;
  title: string;
  release_date: string;
  cover_image_url: string;
  release_year: number;
  is_taylors_version: boolean;
  color: string;
  created_at: string;
}

export interface Song {
  id: number;
  title: string;
  album_id: number;
  track_number: number;
  duration: number;
  created_at: string;
}

export interface UserFavoriteAlbum {
  id: number;
  user_id: string;
  album_id: number;
  created_at: string;
  album?: Album; // Joined data
}

export interface UserFavoriteSong {
  id: number;
  user_id: string;
  song_id: number;
  created_at: string;
  song?: Song; // Joined data
}

export interface SelectionsSummary {
  user_id: string;
  album_count: number;
  album_id: number;
  song_count: number;
}

// Premium user interfaces
export interface PremiumUser {
  id: string;
  is_premium: boolean;
  subscription_type: 'early_adopter' | 'quarterly' | 'none';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  payment_status: 'succeeded' | 'pending' | 'failed';
  payment_type: 'one_time' | 'subscription';
  created_at: string;
}

export interface EarlyAdopterCount {
  id: number;
  current_count: number;
  max_count: number;
  updated_at: string;
}

// Database table names - useful for typed Supabase queries
export enum Tables {
  Albums = 'albums',
  Songs = 'songs',
  UserFavoriteAlbums = 'user_favorite_albums',
  UserFavoriteSongs = 'user_favorite_songs',
  PremiumUsers = 'premium_users',
  PaymentRecords = 'payment_records',
  EarlyAdopterCount = 'early_adopter_count',
}

// Database view names
export enum Views {
  UserSelectionsSummary = 'user_selections_summary',
}
