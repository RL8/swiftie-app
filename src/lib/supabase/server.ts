// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

/**
 * Get a Supabase client instance with service role privileges for server-side operations
 * This function should only be used on the server side where secure operations are needed
 */
export const getSupabase = async () => {
    const supabaseClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    return supabaseClient;
}
