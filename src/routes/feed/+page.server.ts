import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    try {
        // This will now provide a mock session without authentication
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
        // For errors, provide default data without authentication
        console.error('Error loading feed data:', e);
        
        // Return default data that the client can use
        return {
            session: null,
            userData: null,
            feedItems: [],
            authError: null
        };
    }
};

// Explicitly set SSR and CSR to true
export const ssr = true;
export const csr = true;
