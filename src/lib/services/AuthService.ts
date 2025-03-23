import { supabase } from '$lib/supabase/client';

/**
 * Service for handling authentication-related functionality
 */
export class AuthService {
  /**
   * Sign in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Object with success status, user data (if successful), and error message (if failed)
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Register a new user with email and password
   * @param email User's email
   * @param password User's password
   * @returns Object with success status and error message (if failed)
   */
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Sign out the current user
   * @returns Object with success status and error message (if failed)
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Get the current session
   * @returns Object with session data or null if no active session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true,
        session: data.session
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
}
