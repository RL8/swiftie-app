import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { transferAnonymousSelections } from '$lib/services/database';

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
    const code = url.searchParams.get('code');
    
    if (code) {
        // Exchange the code for a session
        const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Error exchanging code for session:', error);
            return {
                error: 'There was an error logging in. Please try again.'
            };
        }
        
        // Get the session
        const { data: { session } } = await locals.supabase.auth.getSession();
        
        if (!session) {
            return {
                error: 'No session found after authentication.'
            };
        }
        
        // Check if the user already has a username
        const { data: profile } = await locals.supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();
            
        // Set a cookie to indicate that anonymous selections should be transferred
        // This will be used by client-side code to transfer selections
        cookies.set('transfer_anonymous_selections', 'true', {
            path: '/',
            maxAge: 300, // 5 minutes
            httpOnly: false, // Allow JavaScript access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        // If no username, redirect to username creation page
        if (!profile?.username) {
            throw redirect(303, '/create-username');
        }
        
        // Otherwise, redirect to feed
        throw redirect(303, '/feed');
    }
    
    // If no code, redirect to home
    throw redirect(303, '/');
};

export const prerender = false;
