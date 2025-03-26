import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    try {
        // This will redirect to login if user is not authenticated
        const { session } = await requireAuth(event);
        
        // Create feed items on the server
        const feedItems = [
            {
                id: 1,
                type: 'welcome',
                timestamp: new Date(),
                content: 'Welcome to your Swiftie feed! Here you\'ll see updates, activities, and content tailored to your favorites.'
            },
            {
                id: 2,
                type: 'activity',
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                user: 'TaylorFan2013',
                action: 'created a new list',
                content: 'Top 10 Taylor Swift Bridges'
            },
            {
                id: 3,
                type: 'suggestion',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                content: 'Try the List Keeper to create your own custom rankings!'
            }
        ];
        
        // Return both the session, user data, and feed items
        return {
            session,
            // User data from session
            userData: session ? {
                email: session.user.email,
                lastLogin: session.user.last_sign_in_at,
                joinDate: session.user.created_at
            } : null,
            // Feed items
            feedItems
        };
    } catch (e) {
        // If there's an authentication error that wasn't caught by requireAuth
        // (which would have redirected), handle it here
        console.error('Error loading feed data:', e);
        
        // Check if it's an authentication error from the hooks
        if (event.locals.authError) {
            // Return a graceful error state that the client can handle
            return {
                session: null,
                userData: null,
                feedItems: [],
                authError: event.locals.authError
            };
        }
        
        // For other errors, throw a proper error response
        throw error(500, {
            message: 'Error loading feed data',
            code: 'FEED_LOAD_ERROR'
        });
    }
};

// Explicitly set SSR and CSR to true
export const ssr = true;
export const csr = true;
