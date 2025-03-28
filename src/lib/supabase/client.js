import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Create a Supabase client for use on the browser with improved cookie handling
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        flowType: 'pkce',  // Use PKCE flow for better security and compatibility
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token',
        storage: {
            getItem: (key) => {
                if (typeof window === 'undefined') return null;
                return window.localStorage.getItem(key);
            },
            setItem: (key, value) => {
                if (typeof window === 'undefined') return;
                window.localStorage.setItem(key, value);
            },
            removeItem: (key) => {
                if (typeof window === 'undefined') return;
                window.localStorage.removeItem(key);
            }
        }
    }
});
