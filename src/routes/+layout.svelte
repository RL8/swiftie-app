<script lang="ts">
    import '../app.css';
    import { navigating, page } from '$app/stores';
    import { browser } from '$app/environment';
    import { onMount, setContext } from 'svelte';
    import { supabase } from '$lib/supabase/client';
    import { invalidate, invalidateAll } from '$app/navigation';
    import AuthErrorModal from '$lib/components/AuthErrorModal.svelte';
    import { createMusicContext } from '$lib/context/music.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import AnonymousSelectionsTransfer from '$lib/components/auth/AnonymousSelectionsTransfer.svelte';
    
    // Get auth error and flag from server via page data
    let currentAuthError = $state(null);
    let isProtectedRouteWithoutAuth = $state(false);
    let needsVerification = $state(false);
    let isEmailVerified = $state(true);
    let currentPath = $state('');
    
    $effect(() => {
        // Get auth error from page data
        currentAuthError = $page.data.authError || null;
        
        // Get protected route flag from server
        isProtectedRouteWithoutAuth = !!$page.data.isProtectedRouteWithoutAuth;
        
        // Get verification status
        needsVerification = !!$page.data.needsVerification;
        isEmailVerified = !!$page.data.isEmailVerified;
        currentPath = $page.data.currentPath || '';
    });
    
    function clearAuthError() {
        currentAuthError = null;
    }
    
    // Only initialize contexts if we're not on a protected route without auth
    // This prevents the context initialization errors for non-authenticated users
    if (!isProtectedRouteWithoutAuth) {
        // Create and set the music context only for authenticated users on protected routes
        const musicContext = $state(createMusicContext());
        
        // Set context
        $effect(() => {
            setContext('music', () => musicContext);
        });
        
        // Make data available to all child components
        $effect(() => {
            setContext('data', $page.data);
        });
    }
    
    // Auth state change listener to synchronize client and server auth state
    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Auth state changed: ${event}`);
            // Only invalidate on actual sign in/out events, NOT on initial session
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                // Force reload all data when auth state changes
                invalidateAll();
            }
            // Skip INITIAL_SESSION as it happens on every page load and causes redirect loops
        });
        
        // Clean up listener on component unmount
        return () => {
            data.subscription.unsubscribe();
        };
    });
</script>

<StandardLayout>
    <div class="flex flex-col min-h-screen">
        {#if needsVerification && !currentPath.startsWith('/auth/verify')}
            <!-- Email verification banner -->
            <div class="bg-yellow-100 border-b border-yellow-200 p-2">
                <div class="container mx-auto px-4 flex justify-between items-center">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-yellow-800">Please verify your email address to access all features.</span>
                    </div>
                    <a href="/auth/verify" class="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">
                        Verify Now
                    </a>
                </div>
            </div>
        {/if}
        
        {#if isProtectedRouteWithoutAuth}
            <!-- For protected routes without authentication, only show a placeholder -->
            <div class="protected-content-placeholder">
                <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 class="text-xl font-semibold mb-2">Sign In Required</h2>
                    <p class="text-gray-600 mb-4">
                        You need to sign in to access this content. Your anonymous selections will be saved when you register.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center gap-2">
                        <a href="/auth/signin" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                            Sign In
                        </a>
                        <a href="/auth/signup" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                            Create Account
                        </a>
                    </div>
                </div>
            </div>
        {:else}
            <!-- For public routes or authenticated users, show actual content -->
            <slot />
        {/if}
        
        <AnonymousSelectionsTransfer />
    </div>
</StandardLayout>

<!-- Auth Error Modal -->
<AuthErrorModal error={currentAuthError} onClose={clearAuthError} />

<style>
    :global(html) {
        background-color: rgb(226, 232, 240);
        height: 100%;
    }

    :global(body) {
        height: 100%;
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .protected-content-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
        background-color: #f9fafb;
    }
</style>