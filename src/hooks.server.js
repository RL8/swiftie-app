import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Determine environment for cookie settings
  const isLocalhost = event.url.hostname === 'localhost' || event.url.hostname === '127.0.0.1';
  const secure = process.env.NODE_ENV === 'production' && !isLocalhost;

  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => {
          const cookie = event.cookies.get(key);
          console.log(`🍪 [Cookie Get] ${key}: ${cookie ? 'exists' : 'missing'}`);
          return cookie;
        },
        set: (key, value, options) => {
          console.log(`🍪 [Cookie Set] Setting ${key} cookie`);
          
          // Important: SameSite must be 'Lax' for authentication cookies to work properly with redirects
          event.cookies.set(key, value, {
            path: '/',
            httpOnly: true,
            secure: secure,
            sameSite: 'lax',
            maxAge: key.includes('refresh') ? 60 * 60 * 24 * 30 : undefined, // 30 days for refresh token
            domain: "." + event.url.host, // Add domain setting for proper cookie scope
            ...options,
          });
        },
        remove: (key, options) => {
          console.log(`🍪 [Cookie Remove] Removing ${key} cookie`);
          event.cookies.delete(key, {
            path: '/',
            httpOnly: true,
            secure: secure,
            sameSite: 'lax',
            ...options,
          });
        },
      },
      auth: {
        flowType: 'pkce',  // Use PKCE flow for better security and compatibility
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    }
  );

  // No authentication checks - all routes are publicly accessible
  
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
}
