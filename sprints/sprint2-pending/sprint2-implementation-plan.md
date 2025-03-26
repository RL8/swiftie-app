# Sprint 2 Implementation Plan: Session and Cookie Management Fixes

This implementation plan addresses the core issues with session management, cookie handling, and authentication flow in the Swiftie app. Each phase focuses on a specific file and includes the exact code changes needed.

## Phase 1: Correct Session and Cookie Settings in hooks.server.js

**File to be edited**: `src/hooks.server.js`

### Change 1: Add domain setting to cookies and improve error handling

```javascript
// In the cookie set function within the createServerClient configuration
set: (key, value, options) => {
  console.log(`🍪 [Cookie Set] Setting ${key} cookie`);
  
  event.cookies.set(key, value, {
    path: '/',
    httpOnly: true,
    secure: secure,
    sameSite: 'lax',
    maxAge: key.includes('refresh') ? 60 * 60 * 24 * 30 : undefined, // 30 days for refresh token
    domain: "." + event.url.host, // Add domain setting for proper cookie scope
    ...options
  });
},
```

### Change 2: Add default value for session data to prevent null reference errors

```javascript
// In the getSession helper function
event.locals.getSession = async () => {
  const {
    data: { session } = {data:{session:null}}, // Add default value to prevent null reference
  } = await event.locals.supabase.auth.getSession();
  return session;
};
```

## Phase 2: Simplify Authentication Flow in hooks.server.js

**File to be edited**: `src/hooks.server.js`

### Change 1: Remove excessive cookie verification code

```javascript
// Replace the entire authenticateAndAuthorize function with this simplified version
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
    
    // If authenticated but email not verified, redirect to verification page
    // Uncomment this for production use, comment out for testing
    /*
    if (authResult.status === 'unverified' && !currentPath.startsWith(verificationPath)) {
      console.log(`🔄 Redirecting to verification page from ${currentPath}`);
      throw redirect(303, verificationPath);
    }
    */
    
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
```

## Phase 3: Optimize Layout Server Load Function

**File to be edited**: `src/routes/+layout.server.ts`

### Change: Simplify the layout server load function

```typescript
// Replace the current load function with this simplified version
export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Get auth error and protected route flag from hooks
  const authError = locals.authError || null;
  const isProtectedRouteWithoutAuth = locals.isProtectedRouteWithoutAuth || false;
  
  // Get authentication session if available
  const authenticatedSession = locals.authenticatedSession || null;
  
  // Initialize auth service
  const authService = new AuthService({ locals });
  
  // Check email verification status
  let isEmailVerified = true; // Default to true for non-authenticated users
  let needsVerification = false;
  
  if (authenticatedSession) {
    try {
      const verificationResult = await authService.isEmailVerified();
      isEmailVerified = verificationResult.verified;
      needsVerification = !isEmailVerified;
    } catch (error) {
      console.error('Error checking email verification status:', error);
    }
  }
  
  return {
    authError,
    isProtectedRouteWithoutAuth,
    authenticatedSession,
    isEmailVerified,
    needsVerification,
    currentPath: url.pathname
  };
};
```

## Phase 4: Fix Feed Page Component

**File to be edited**: `src/routes/feed/+page.svelte`

### Change 1: Fix imports and remove unnecessary ones

```svelte
<script lang="ts">
    // Remove onMount import
    import type { AppContext } from '$lib/context/app.svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    // Remove StandardLayout import
    import ContextPlaceholder from '$lib/components/ContextPlaceholder.svelte';
    import { getSafeAppContext, getSafeMusicContext, isContextAvailable } from '$lib/utils/context-helpers';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    
    // Rest of the script remains the same...
</script>
```

### Change 2: Fix the auth state change listener

```svelte
<!-- Replace the onMount block with this direct listener -->
<script lang="ts">
    // ... existing code ...
    
    // Auth state change listener to synchronize client and server auth state
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log(`Auth state changed: ${event}`);
        // Only invalidate on actual sign in/out events, NOT on initial session
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            // Force a page reload to refresh the server session
            window.location.reload();
        }
    });
    
    // Clean up subscription when component is destroyed
    onDestroy(() => {
        if (data && data.subscription) {
            data.subscription.unsubscribe();
        }
    });
</script>
```

### Change 3: Fix the layout structure

```svelte
<!-- Replace the StandardLayout wrapper with proper structure -->
<div class="feed-page">
    <Header title="Your Feed" />
    
    <!-- Rest of the content remains the same... -->
</div>

<!-- Remove the closing StandardLayout tag at the end -->
```

### Change 4: Fix indentation in the template

```svelte
<!-- Fix indentation in these sections -->
<div class="item-content">
    <p>{item.content}</p>
    <span class="timestamp">{formatTime(item.timestamp)}</span>
</div>

<div class="activity-item">
    <div class="item-icon">👤</div>
    <div class="item-content">
        <p><span class="username">{item.user}</span> {item.action}</p>
        <p class="content-preview">"{item.content}"</p>
        <span class="timestamp">{formatTime(item.timestamp)}</span>
    </div>
</div>
```

## Testing Plan

After implementing these changes, we will manually test the following scenarios:

1. User registration and login flow
2. Session persistence across page refreshes
3. Protected route access with and without authentication
4. Cookie behavior in different environments (localhost, production)

The implementation focuses on simplifying the authentication flow, fixing cookie management, and ensuring proper session handling throughout the application.
