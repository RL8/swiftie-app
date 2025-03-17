import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          event.cookies.set(key, value, {
            path: '/',
            ...options,
          })
        },
        remove: (key, options) => {
          event.cookies.delete(key, {
            path: '/',
            ...options,
          })
        },
      },
    }
  );

  // Get the session from the cookies
  const {
    data: { session },
  } = await event.locals.supabase.auth.getSession();

  // If there's no session and the user is trying to access a protected route
  const protectedRoutes = ['/profile', '/feed'];
  const isRequestingProtectedRoute = protectedRoutes.some((route) => 
    event.url.pathname.startsWith(route)
  );

  if (!session && isRequestingProtectedRoute) {
    throw redirect(303, `/login?redirectTo=${event.url.pathname}`);
  }

  // Expose session to client
  event.locals.session = session;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
}
