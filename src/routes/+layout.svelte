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
    
    // Get auth error and flag from server via page data
    let currentAuthError = $state(null);
    let isProtectedRouteWithoutAuth = $state(false);
    
    $effect(() => {
        // Get auth error from page data
        currentAuthError = $page.data.authError || null;
        
        // Get protected route flag from server
        isProtectedRouteWithoutAuth = !!$page.data.isProtectedRouteWithoutAuth;
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
        {#if isProtectedRouteWithoutAuth}
            <!-- For protected routes without authentication, only show a placeholder -->
            <div class="protected-content-placeholder">
                <!-- Content will be hidden until user is authenticated -->
                <!-- The AuthErrorModal will appear over this placeholder -->
            </div>
        {:else}
            <!-- For public routes or authenticated users, show actual content -->
            <slot />
        {/if}
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