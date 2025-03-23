import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase/client';

// Define the user interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

// Create a writable store with initial empty user state
export const user = writable<User | null>(null);

// Function to set the user in the store
export function setUser(userData: User | null): void {
  user.set(userData);
}

// Function to update user profile
export async function updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the current user from the store
    let currentUser: User | null = null;
    
    // Unsubscribe after getting the value
    const unsubscribe = user.subscribe(value => {
      currentUser = value;
    });
    unsubscribe();
    
    if (!currentUser || !currentUser.id) {
      return { success: false, error: 'No user is currently logged in' };
    }
    
    // Update the user profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', currentUser.id)
      .select()
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Update the user store with the new data
    user.update(u => {
      if (u) {
        return { ...u, ...data };
      }
      return u;
    });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

// Function to load the user profile from Supabase
export async function loadUserProfile(): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setUser(null);
      return { success: false, error: 'No active session' };
    }
    
    const userId = session.user.id;
    
    // Fetch the user profile from the database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Set the user in the store
    setUser({
      id: userId,
      email: session.user.email || '',
      name: data.name || '',
      avatar_url: data.avatar_url
    });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}
