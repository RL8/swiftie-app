<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { UserProfileContext } from '$lib/context/user.svelte';
    import { supabase } from '$lib/supabase/client';
    
    // Get the user context function but don't invoke it immediately
    const getUserContext = getContext<() => UserProfileContext>('user');
    
    // Setup onMount effect to initialize authentication state
    onMount(() => {
        // Get the user context when needed
        const user = getUserContext();
        
        // Initialize user data from Supabase
        user.initializeFromSupabase();
        
        // Setup auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Get the user context when needed
            const user = getUserContext();
            
            // Re-initialize user data on auth state changes
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                user.initializeFromSupabase();
            }
        });
        
        // Cleanup subscription on component destroy
        return () => {
            subscription.unsubscribe();
        };
    });
</script>

<!-- This is a utility component with no UI -->
