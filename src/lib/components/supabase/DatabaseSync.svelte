<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { supabase } from '$lib/supabase/client';
    
    // Get the music context function but don't invoke it immediately
    const getMusicContext = getContext<() => MusicContext>('music');
    
    // Setup effects to handle authentication state changes
    let isAuthenticated: boolean = $state(false);
    
    function checkAuth() {
        supabase.auth.getSession().then(({ data }) => {
            isAuthenticated = !!data.session;
            
            // Initialize the music context with database data if authenticated
            if (isAuthenticated) {
                // Invoke the function to get the music context when needed
                const music = getMusicContext();
                music.initialize();
            }
        });
    }
    
    // Listen for auth state changes
    onMount(() => {
        // Initial check
        checkAuth();
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            isAuthenticated = !!session;
            
            if (event === 'SIGNED_IN') {
                // User just signed in, load their data
                const music = getMusicContext();
                music.initialize();
            } else if (event === 'SIGNED_OUT') {
                // Clear selections when user signs out
                const music = getMusicContext();
                music.clearSelections();
            }
        });
        
        // Cleanup subscription on component destroy
        return () => {
            subscription.unsubscribe();
        };
    });
</script>

<!-- This is a utility component with no UI -->
