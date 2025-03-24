import { getContext } from 'svelte';
import type { AppContext } from '$lib/context/app.svelte';
import type { MusicContext } from '$lib/context/music.svelte';

/**
 * Centralized context helper utilities
 * These functions safely access contexts, providing fallback values when contexts don't exist
 */

// Default values for contexts when they're not available
const DEFAULT_APP_CONTEXT: AppContext = {
  state: {
    status: 'guest',
    hasCompletedOrientation: false,
    subscription: 'free'
  },
  completeOrientation: () => console.warn('App context not available: completeOrientation called'),
  setAuthenticated: () => console.warn('App context not available: setAuthenticated called'),
  setGuest: () => console.warn('App context not available: setGuest called'),
  setPremium: () => console.warn('App context not available: setPremium called'),
  setFree: () => console.warn('App context not available: setFree called'),
  reset: () => console.warn('App context not available: reset called')
};

const DEFAULT_MUSIC_CONTEXT: MusicContext = {
  selectedAlbums: [],
  selectedSongs: {},
  selectedSongsCount: 0,
  addAlbum: () => console.warn('Music context not available: addAlbum called'),
  removeAlbum: () => console.warn('Music context not available: removeAlbum called'),
  toggleSong: () => console.warn('Music context not available: toggleSong called'),
  reset: () => console.warn('Music context not available: reset called')
};

/**
 * Safely get the app context, providing a fallback if it doesn't exist
 * @returns The app context or a fallback object
 */
export function getSafeAppContext(): AppContext {
  try {
    // Try to get the real context
    const contextFn = getContext<() => AppContext>('app');
    if (typeof contextFn === 'function') {
      return contextFn();
    }
    
    console.warn('App context not available or not a function, using fallback');
    return DEFAULT_APP_CONTEXT;
  } catch (error) {
    console.warn('Error accessing app context, using fallback', error);
    return DEFAULT_APP_CONTEXT;
  }
}

/**
 * Safely get the music context, providing a fallback if it doesn't exist
 * @returns The music context or a fallback object
 */
export function getSafeMusicContext(): MusicContext {
  try {
    // Try to get the real context
    const contextFn = getContext<() => MusicContext>('music');
    if (typeof contextFn === 'function') {
      return contextFn();
    }
    
    console.warn('Music context not available or not a function, using fallback');
    return DEFAULT_MUSIC_CONTEXT;
  } catch (error) {
    console.warn('Error accessing music context, using fallback', error);
    return DEFAULT_MUSIC_CONTEXT;
  }
}

/**
 * Check if a specific context is available
 * @param contextName The name of the context to check
 * @returns True if the context exists, false otherwise
 */
export function isContextAvailable(contextName: string): boolean {
  try {
    const context = getContext(contextName);
    return context !== undefined;
  } catch {
    return false;
  }
}

/**
 * Generates a friendly message about missing context
 * @param contextName The name of the context that's missing
 * @returns A user-friendly message
 */
export function getContextPlaceholderMessage(contextName: string): string {
  switch(contextName) {
    case 'app':
      return 'App settings are not available yet. Some features may be limited.';
    case 'music':
      return 'Music preferences are not loaded yet. Try visiting the music selection page first.';
    default:
      return `${contextName} is not available yet.`;
  }
}
