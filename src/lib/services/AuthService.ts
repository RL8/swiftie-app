import { supabase } from '$lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { UserType } from '$lib/types/auth';

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
  
  /**
   * Check if the current user's email is verified
   * @returns Object with verification status and error message (if failed)
   */
  async isEmailVerified() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          error: error.message,
          verified: false
        };
      }
      
      if (!data.session) {
        return {
          success: false,
          error: 'No active session',
          verified: false
        };
      }
      
      // Check if email is confirmed
      const isVerified = !!data.session.user.email_confirmed_at;
      
      return {
        success: true,
        verified: isVerified
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        verified: false
      };
    }
  }
  
  /**
   * Resend verification email to the current user
   * @returns Object with success status and error message (if failed)
   */
  async resendVerificationEmail() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        return {
          success: false,
          error: sessionError.message
        };
      }
      
      if (!sessionData.session) {
        return {
          success: false,
          error: 'No active session'
        };
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: sessionData.session.user.email
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true,
        message: 'Verification email sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Update the email address of the current user
   * @param newEmail The new email address
   * @returns Object with success status and error message (if failed)
   */
  async updateEmail(newEmail: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      // Resend verification email to the new address
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: newEmail
      });
      
      if (resendError) {
        return {
          success: true,
          message: 'Email updated successfully, but there was an error sending the verification email',
          warning: resendError.message
        };
      }
      
      return {
        success: true,
        message: 'Email updated successfully. Please check your inbox for a verification link.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Get the authentication status and user type of the current user
   * @returns Object with status, userType and optional authData
   */
  async getAuthStatus(): Promise<{ status: string, userType: UserType, authData?: User, isVerified?: boolean }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthService: Error getting session:', error);
        return { status: 'error', userType: UserType.VISITOR };
      }
      
      const session = data.session;
      
      // Check if we have a session
      if (!session) {
        return { status: 'not-authenticated', userType: UserType.VISITOR };
      }
      
      // Check if email is verified
      const isVerified = !!session.user.email_confirmed_at;
      
      // If email is not verified, return early with verification status
      if (!isVerified) {
        return { 
          status: 'unverified', 
          userType: UserType.BASIC_USER, 
          authData: session.user,
          isVerified: false
        };
      }
      
      // We have an auth session, therefore the status is authenticated (or higher)
      // So it's safe to query premium status
      let userType = UserType.BASIC_USER;
      let isPremium = false;
      
      try {
        // check if the user is a premium user
        const { data: premiumUser, error: premiumError } = await supabase
          .from('premium_users')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        
        if (premiumError) {
          console.error('AuthService: Error getting premium status:', premiumError);
          // Fallback to basic user if there's an error
          userType = UserType.BASIC_USER;
        } else {
          isPremium = premiumUser?.is_premium || false;
          
          // Set user type to Premium or Basic
          userType = isPremium ? UserType.PREMIUM_USER : UserType.BASIC_USER;
        }
      } catch (premiumErr) {
        console.error('AuthService: Exception while checking premium status:', premiumErr);
      }
      
      // User is Authenticated
      return { 
        status: 'authenticated', 
        userType: userType, 
        authData: session.user,
        isVerified: true
      };
    } catch (e) {
      console.error('AuthService: Unexpected error getting auth status:', e);
      // Handle unexpected errors
      return { status: 'error', userType: UserType.VISITOR };
    }
  }
}
