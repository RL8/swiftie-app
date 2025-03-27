/**
 * Utility functions for working with localStorage
 * Provides type-safe access to localStorage with SSR compatibility
 */

import { browser } from '$app/environment';
import type { Album } from '$lib/types/components';

// Define types for stored data
export interface StoredUserSelections {
  selectedAlbums: Album[];
  selectedSongsByAlbum: Record<string, string[]>;
  userName: string;
  lastUpdated: string;
}

// Default values
const DEFAULT_USER_SELECTIONS: StoredUserSelections = {
  selectedAlbums: [],
  selectedSongsByAlbum: {},
  userName: "Taylor Swift Fan",
  lastUpdated: new Date().toISOString()
};

/**
 * Save user selections to localStorage
 */
export function saveUserSelections(selections: StoredUserSelections): void {
  if (!browser) return;
  
  try {
    localStorage.setItem('userSelections', JSON.stringify({
      ...selections,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving user selections to localStorage:', error);
  }
}

/**
 * Load user selections from localStorage
 */
export function loadUserSelections(): StoredUserSelections {
  if (!browser) return { ...DEFAULT_USER_SELECTIONS };
  
  try {
    const storedData = localStorage.getItem('userSelections');
    if (!storedData) return { ...DEFAULT_USER_SELECTIONS };
    
    const parsedData = JSON.parse(storedData) as Partial<StoredUserSelections>;
    
    // Ensure all required properties exist
    return {
      selectedAlbums: parsedData.selectedAlbums || [],
      selectedSongsByAlbum: parsedData.selectedSongsByAlbum || {},
      userName: parsedData.userName || DEFAULT_USER_SELECTIONS.userName,
      lastUpdated: parsedData.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading user selections from localStorage:', error);
    return { ...DEFAULT_USER_SELECTIONS };
  }
}

/**
 * Clear user selections from localStorage
 */
export function clearUserSelections(): void {
  if (!browser) return;
  
  try {
    localStorage.removeItem('userSelections');
  } catch (error) {
    console.error('Error clearing user selections from localStorage:', error);
  }
}

/**
 * Update user name in localStorage
 */
export function updateUserName(name: string): void {
  if (!browser) return;
  
  try {
    const currentSelections = loadUserSelections();
    saveUserSelections({
      ...currentSelections,
      userName: name
    });
  } catch (error) {
    console.error('Error updating user name in localStorage:', error);
  }
}

/**
 * Convert Map to Record for storage
 * This is needed because Maps don't serialize well to JSON
 */
export function mapToRecord<K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V> {
  const record = {} as Record<K, V>;
  map.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

/**
 * Convert Record to Map for usage
 */
export function recordToMap<K extends string | number | symbol, V>(record: Record<K, V>): Map<K, V> {
  const map = new Map<K, V>();
  Object.entries(record).forEach(([key, value]) => {
    map.set(key as K, value as V);
  });
  return map;
}
