import { supabase } from '$lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { UserType } from '$lib/types/auth';

/**
 * Service for handling authentication-related functionality
 * Modified to provide mock authentication without requiring actual login
 */
export class AuthService {
  status: string;
  userType: UserType;
  authData?: User;
  isVerified?: boolean;
  session?: Session;
  
  constructor(private event?: any) {}
  
  /**
   * Get the authentication status and user type of the current user
   * @returns Object with status, userType and optional authData
   */
  async getAuthStatus(): Promise<{ status: string, userType: UserType, authData?: User, isVerified?: boolean, session?: Session }> {
    try {
      // Create a mock session that's always authenticated
      const mockUser = {
        id: 'mock-user-id',
        email: 'user@example.com',
        user_metadata: {
          username: 'swiftie_fan',
          full_name: 'Taylor Swift Fan'
        },
        app_metadata: {
          provider: 'mock',
          providers: ['mock']
        },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600,
        user: mockUser
      };
      
      this.status = 'authenticated';
      this.userType = UserType.Registered;
      this.authData = mockUser as User;
      this.isVerified = true;
      this.session = mockSession as Session;
      
      return {
        status: this.status,
        userType: this.userType,
        authData: this.authData,
        isVerified: this.isVerified,
        session: this.session
      };
    } catch (error) {
      console.error('Error getting auth status:', error);
      
      // Even on error, return a mock authenticated session
      return {
        status: 'authenticated',
        userType: UserType.Registered,
        authData: {
          id: 'mock-user-id',
          email: 'user@example.com'
        } as User,
        isVerified: true,
        session: {
          access_token: 'mock-access-token',
          user: {
            id: 'mock-user-id',
            email: 'user@example.com'
          }
        } as Session
      };
    }
  }
  
  /**
   * Get the current session
   * @returns Object with session data or null if no active session
   */
  async getSession() {
    try {
      // Return a mock session
      return {
        data: {
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_at: Date.now() + 3600,
            user: {
              id: 'mock-user-id',
              email: 'user@example.com',
              user_metadata: {
                username: 'swiftie_fan',
                full_name: 'Taylor Swift Fan'
              }
            }
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: { session: null },
        error: error.message || 'An unexpected error occurred'
      };
    }
  }
  
  /**
   * Check if the current user's email is verified
   * @returns Object with verification status and error message (if failed)
   */
  async isEmailVerified() {
    // Always return verified in the mock system
    return {
      isVerified: true,
      success: true
    };
  }
  
  /**
   * Update the email address of the current user
   * @param newEmail The new email address
   * @returns Object with success status and error message (if failed)
   */
  async updateEmail(newEmail: string) {
    // Mock successful email update
    return {
      success: true,
      message: 'Email updated successfully'
    };
  }
}
