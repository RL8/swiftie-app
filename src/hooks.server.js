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

  // Helper function to get user's session
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  // If there's no session and the user is trying to access a protected route
  const protectedRoutes = ['/profile', '/feed', '/create-username'];
  const isRequestingProtectedRoute = protectedRoutes.some((route) => 
    event.url.pathname.startsWith(route)
  );

  // Special case for create-username route which requires auth but not a username
  const isRequestingUsernameCreation = event.url.pathname.startsWith('/create-username');

  if (!session && isRequestingProtectedRoute) {
    throw redirect(303, `/login?redirectTo=${event.url.pathname}`);
  }

  // If user is authenticated and has a session, check if they need to create a username
  // Skip this check for the create-username route itself
  if (session && !isRequestingUsernameCreation) {
    // Check if user has a username in their profile
    const { data: profile } = await event.locals.supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single();
    
    // If no username found, redirect to username creation
    if (!profile?.username) {
      throw redirect(303, '/create-username');
    }
  }

  // Expose session to client
  event.locals.session = session;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
}
