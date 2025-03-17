/**
 * Mock Supabase client for testing
 * This provides mock implementations of Supabase methods used in our app
 */

// Mock session data
export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    }
  },
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token'
};

// Mock Supabase client
export const createMockSupabaseClient = (options: {
  authenticated?: boolean;
  signInSuccess?: boolean;
  signUpSuccess?: boolean;
} = {}) => {
  const {
    authenticated = false,
    signInSuccess = true,
    signUpSuccess = true
  } = options;

  return {
    auth: {
      getSession: vi.fn().mockReturnValue({
        data: {
          session: authenticated ? mockSession : null
        },
        error: null
      }),
      signInWithPassword: vi.fn().mockReturnValue({
        data: signInSuccess ? { session: mockSession } : null,
        error: signInSuccess ? null : { message: 'Invalid login credentials' }
      }),
      signUp: vi.fn().mockReturnValue({
        data: signUpSuccess ? { user: mockSession.user } : null,
        error: signUpSuccess ? null : { message: 'Email already registered' }
      }),
      signOut: vi.fn().mockReturnValue({
        error: null
      }),
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        // You can trigger this manually in tests
        return { unsubscribe: vi.fn() };
      })
    },
    from: vi.fn().mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      data: table === 'favorites' ? [
        { id: 'fav1', user_id: 'test-user-id', album_id: 'album1', created_at: new Date().toISOString() },
        { id: 'fav2', user_id: 'test-user-id', album_id: 'album2', created_at: new Date().toISOString() }
      ] : [],
      error: null
    }))
  };
};

// Export vi for Vitest mocking
import { vi } from 'vitest';
