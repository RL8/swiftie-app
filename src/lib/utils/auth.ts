import { supabase } from '$lib/supabase/client';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Check if user is authenticated and redirect to login if not
 */
export async function requireAuth(event: RequestEvent) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // Save the requested URL to redirect back after login
        const redirectTo = event.url.pathname + event.url.search;
        throw redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
    
    return {
        session
    };
}
