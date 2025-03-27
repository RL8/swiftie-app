import type { RequestEvent } from '@sveltejs/kit';

/**
 * Mock authentication function that always returns success
 * This replaces the original requireAuth function to remove authentication restrictions
 * while maintaining compatibility with existing code
 */
export async function requireAuth(event: RequestEvent) {
    // Create a mock session that will satisfy code expecting an authenticated user
    const mockSession = {
        user: {
            id: 'local-user',
            email: 'local@example.com',
            user_metadata: {
                username: 'LocalUser'
            }
        },
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600 * 1000
    };
    
    // Return the mock session to satisfy code expecting an authenticated session
    return {
        session: mockSession
    };
}
