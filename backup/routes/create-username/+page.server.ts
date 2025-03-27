import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Get the session from locals
    const session = await locals.getSession();
    
    // If no session, redirect to login
    if (!session) {
        throw redirect(303, '/login');
    }
    
    // Check if user already has a username in their profile
    const { data: profile } = await locals.supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();
    
    // If they already have a username, redirect to feed
    if (profile?.username) {
        throw redirect(303, '/feed');
    }
    
    // Otherwise, allow access to the create-username page
    return {
        user: session.user
    };
};
