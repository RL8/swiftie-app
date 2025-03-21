import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
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
