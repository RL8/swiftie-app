<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase/client';
    
    let loading: boolean = $state(true);
    let error: string | null = $state<string | null>(null);
    
    onMount(async () => {
        try {
            // Handle the OAuth callback
            const { data, error: authError } = await supabase.auth.getSession();
            
            if (authError) {
                throw authError;
            }
            
            // Get the URL to redirect to after authentication
            const redirectTo = localStorage.getItem('redirectTo') || '/feed';
            
            // Clear stored redirect
            localStorage.removeItem('redirectTo');
            
            // Redirect to the appropriate page
            goto(redirectTo);
        } catch (err) {
            console.error('Error in auth callback:', err);
            error = err instanceof Error ? err.message : 'Authentication failed';
        } finally {
            loading = false;
        }
    });
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h1 class="text-2xl font-bold text-center text-gray-800">
            {#if loading}
                Completing Authentication...
            {:else if error}
                Authentication Error
            {:else}
                Redirecting...
            {/if}
        </h1>
        
        {#if loading}
            <div class="flex justify-center py-4">
                <div class="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
            <p class="text-center text-gray-600">Please wait while we authenticate your account...</p>
        {:else if error}
            <div class="p-4 bg-red-100 text-red-700 rounded-md">
                <p class="font-medium">Authentication failed</p>
                <p class="text-sm">{error}</p>
            </div>
            <div class="text-center">
                <a href="/login" class="inline-block px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700">
                    Return to Login
                </a>
            </div>
        {/if}
    </div>
</div>
