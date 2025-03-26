import { supabase } from '$lib/supabase/client';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Check if user is authenticated and redirect to login if not
 * This function has been enhanced to handle authentication errors more gracefully
 */
export async function requireAuth(event: RequestEvent) {
    try {
        // First check if there's already an auth error in locals from hooks
        if (event.locals.authError) {
            console.log('Auth error detected in requireAuth:', event.locals.authError.type);
            return { session: null, authError: event.locals.authError };
        }
        
        // Try to get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // If there's a session error, log it
        if (sessionError) {
            console.error('Session error in requireAuth:', sessionError.message);
        }
        
        // If no session, redirect to login
        if (!session) {
            // Save the requested URL to redirect back after login
            const redirectTo = event.url.pathname + event.url.search;
            throw redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
        
        // Check for cookie inconsistencies
        const cookieHeader = event.request.headers.get('cookie') || '';
        const hasAuthCookie = cookieHeader.includes('sb-') && 
                             (cookieHeader.includes('-auth-token') || 
                              cookieHeader.includes('access-token'));
        
        // If we have a session but no auth cookie, there's an inconsistency
        if (session && !hasAuthCookie) {
            console.warn('Session/cookie inconsistency detected in requireAuth');
            
            // Instead of redirecting, return both the session and an error flag
            return {
                session,
                authError: {
                    type: 'session_cookie_mismatch',
                    message: 'Your session exists but authentication cookies are missing',
                    details: {
                        suggestedAction: 'Please try refreshing the page or logging in again'
                    }
                }
            };
        }
        
        // Everything is good, return the session
        return {
            session
        };
    } catch (error) {
        // If it's a redirect, let it propagate
        if (error.status === 303) {
            throw error;
        }
        
        // For other errors, log and return an error object
        console.error('Unexpected error in requireAuth:', error);
        return {
            session: null,
            authError: {
                type: 'auth_error',
                message: 'An unexpected authentication error occurred',
                details: {
                    error: error instanceof Error ? error.message : String(error),
                    suggestedAction: 'Please try logging in again'
                }
            }
        };
    }
}
