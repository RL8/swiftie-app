import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

// Define the type for anonymous selections
export interface AnonymousSelection {
  id: string;
  type: 'album' | 'song' | 'artist' | 'swiftivity';
  name: string;
  imageUrl?: string;
  selectedAt: string;
}

// Define the store type
interface AnonymousSelectionsStore {
  selections: AnonymousSelection[];
  lastUpdated: string | null;
}

// Initialize the store with default values
const createAnonymousSelectionsStore = () => {
  // Default empty store state
  const defaultState: AnonymousSelectionsStore = {
    selections: [],
    lastUpdated: null
  };

  // Create the writable store
  const { subscribe, set, update } = writable<AnonymousSelectionsStore>(defaultState);

  // Load data from localStorage on initialization (client-side only)
  if (browser) {
    const storedData = localStorage.getItem('anonymousSelections');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        set(parsedData);
      } catch (error) {
        console.error('Error parsing stored anonymous selections:', error);
      }
    }
  }

  // Helper function to save to localStorage
  const saveToLocalStorage = (data: AnonymousSelectionsStore) => {
    if (browser) {
      localStorage.setItem('anonymousSelections', JSON.stringify(data));
    }
  };

  return {
    subscribe,
    
    // Add a new selection
    addSelection: (selection: Omit<AnonymousSelection, 'selectedAt'>) => {
      update(state => {
        // Check if this item already exists
        const existingIndex = state.selections.findIndex(
          item => item.id === selection.id && item.type === selection.type
        );
        
        const now = new Date().toISOString();
        
        // If it exists, update it
        if (existingIndex >= 0) {
          const updatedSelections = [...state.selections];
          updatedSelections[existingIndex] = {
            ...selection,
            selectedAt: now
          };
          
          const updatedState = {
            selections: updatedSelections,
            lastUpdated: now
          };
          
          saveToLocalStorage(updatedState);
          return updatedState;
        }
        
        // Otherwise add it
        const newSelection: AnonymousSelection = {
          ...selection,
          selectedAt: now
        };
        
        const updatedState = {
          selections: [...state.selections, newSelection],
          lastUpdated: now
        };
        
        saveToLocalStorage(updatedState);
        return updatedState;
      });
    },
    
    // Remove a selection
    removeSelection: (id: string, type: AnonymousSelection['type']) => {
      update(state => {
        const updatedSelections = state.selections.filter(
          item => !(item.id === id && item.type === type)
        );
        
        const now = new Date().toISOString();
        const updatedState = {
          selections: updatedSelections,
          lastUpdated: now
        };
        
        saveToLocalStorage(updatedState);
        return updatedState;
      });
    },
    
    // Get selections by type
    getSelectionsByType: (type: AnonymousSelection['type']) => {
      const state = get({ subscribe });
      return state.selections.filter(item => item.type === type);
    },
    
    // Clear all selections
    clearSelections: () => {
      const now = new Date().toISOString();
      const updatedState = {
        selections: [],
        lastUpdated: now
      };
      
      saveToLocalStorage(updatedState);
      set(updatedState);
    },
    
    // Export all selections (for transferring to user account)
    exportSelections: () => {
      const state = get({ subscribe });
      return state.selections;
    }
  };
};

// Create and export the store
export const anonymousSelections = createAnonymousSelectionsStore();
