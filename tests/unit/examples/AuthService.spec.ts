import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../../src/lib/services/AuthService';

// Mock the Supabase client
vi.mock('$lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn()
    }
  }
}));

// Import the mocked client
import { supabase } from '$lib/supabase/client';

describe('AuthService', () => {
  let authService;
  
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    
    // Create a new instance of AuthService
    authService = new AuthService();
  });
  
  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      // Mock successful sign in
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' }, session: { access_token: 'token-123' } },
        error: null
      });
      
      const result = await authService.signIn('test@example.com', 'password123');
      
      // Verify the result
      expect(result.success).toBe(true);
      expect(result.user).toEqual({ id: 'user-123', email: 'test@example.com' });
      
      // Verify Supabase was called with correct parameters
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    it('should handle sign in failure', async () => {
      // Mock failed sign in
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });
      
      const result = await authService.signIn('test@example.com', 'wrong-password');
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });
  
  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      // Mock successful sign up
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-123', email: 'new@example.com' }, session: null },
        error: null
      });
      
      const result = await authService.signUp('new@example.com', 'password123');
      
      // Verify the result
      expect(result.success).toBe(true);
      
      // Verify Supabase was called with correct parameters
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123'
      });
    });
    
    it('should handle sign up failure', async () => {
      // Mock failed sign up
      supabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already in use' }
      });
      
      const result = await authService.signUp('existing@example.com', 'password123');
      
      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already in use');
    });
  });
  
  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      // Mock successful sign out
      supabase.auth.signOut.mockResolvedValue({
        error: null
      });
      
      const result = await authService.signOut();
      
      // Verify the result
      expect(result.success).toBe(true);
      
      // Verify Supabase was called
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
