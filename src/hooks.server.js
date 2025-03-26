import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, error } from '@sveltejs/kit';
import { UserType } from '$lib/types/auth';
import { AuthService } from '$lib/services/AuthService';

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

  // Get the session from the cookies
  const {
    data: { session },
  } = await event.locals.supabase.auth.getSession();

  // Helper function to get user's session
  event.locals.getSession = async () => {
    const {
      data: { session } = {data:{session:null}}, // Add default value to prevent null reference
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  // Expose session to client
  event.locals.session = session;
  
  // Initialize the auth service with the event
  event.locals.authService = new AuthService(event);
  
  // Centralized authentication and authorization check
  await authenticateAndAuthorize(event);

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
}

/**
 * Centralized authentication and authorization function
 * Handles route protection and redirects based on authentication status and user type
 */
async function authenticateAndAuthorize(event) {
  const authService = new AuthService(event);
  const authResult = await authService.getAuthStatus();
  
  // Check for protected routes that require authentication
  const protectedPaths = ['/feed', '/premium', '/profile', '/video-upload', '/swiftivities'];
  const publicPaths = ['/login', '/signup', '/create-username', '/auth/callback'];
  const verificationPath = '/auth/verify';
  
  const currentPath = event.url.pathname;
  
  // Centralized Protected route logic
  if (protectedPaths.some(path => currentPath.startsWith(path))) {
    // Require authentication for protected routes
    if (authResult.status !== 'authenticated' && authResult.status !== 'unverified') {
      console.log(`🔒 Access denied to ${currentPath}: Not authenticated`);
      
      // Set auth error and a clear flag so pages know not to initialize contexts
      event.locals.authError = {
        type: 'authentication_required',
        message: 'You must be logged in to access this page',
        details: {
          path: currentPath,
          status: authResult.status,
          reason: authResult.status === 'unknown' ? 'Session not found' : 
                  'Invalid authentication state'
        }
      };
      
      // Add a clear flag for the layout to know this is a protected route with no auth
      event.locals.isProtectedRouteWithoutAuth = true;
      
      // Return without redirecting - the layout will handle showing appropriate UI
      return;
    }
    
    // TEMPORARY: Skip verification check and redirect
    // Original code:
    // // If authenticated but email not verified, redirect to verification page
    // if (authResult.status === 'unverified' && !currentPath.startsWith(verificationPath)) {
    //   console.log(`🔄 Redirecting to verification page from ${currentPath}`);
    //   throw redirect(303, verificationPath);
    // }
    
    // User is authenticated and verified, continue
    console.log(`✅ Access granted to ${currentPath}`);
    
    // Make session available to routes - ensure we're setting the full session data
    event.locals.authenticatedSession = {
      session: event.locals.session,
      user: event.locals.session?.user,
      authResult
    };
    
    return;
  }
  
  // Premium-only routes
  if (currentPath.startsWith('/premium')) {
    // Check premium status and user type
    if (authResult.userType < UserType.PREMIUM_USER) {
      console.log(`💰 Access denied to ${currentPath}: Not a premium user`);
      throw redirect(303, '/upgrade');
    }
  }
}
