<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase/client';
    import { getContext } from 'svelte';
    import type { UserProfileContext } from '$lib/context/user.svelte';
    
    // Get user context function
    const getUserContext = getContext<() => UserProfileContext>('user');
    const userContext = getUserContext();
    
    // Using Svelte 5 runes for state management
    const state = $state({
        username: '',
        redditUsername: '',
        loading: false,
        checking: false,
        error: null as string | null,
        isAvailable: false,
        wasChecked: false
    });
    
    // Reddit-like username validation
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const isUsernameValid = $derived(usernameRegex.test(state.username));
    const isFormValid = $derived(isUsernameValid && state.isAvailable && state.wasChecked);
    
    // Check if username is available
    async function checkUsernameAvailability() {
        if (!isUsernameValid) return;
        
        state.checking = true;
        state.error = null;
        state.wasChecked = true;
        
        try {
            // Query the database to check if username exists
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', state.username)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                // PGRST116 means no rows returned, which is what we want
                throw error;
            }
            
            state.isAvailable = !data;
            
            if (!state.isAvailable) {
                state.error = `Username "${state.username}" is already taken`;
            }
        } catch (err) {
            console.error('Error checking username:', err);
            state.error = err instanceof Error ? err.message : 'An error occurred checking username';
            state.isAvailable = false;
        } finally {
            state.checking = false;
        }
    }
    
    // Save username and complete profile setup
    async function saveUsername() {
        if (!isFormValid) return;
        
        state.loading = true;
        state.error = null;
        
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) throw new Error('No authenticated user found');
            
            // Update profile with username
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: state.username,
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
            
            // Update local user context
            userContext.setUsername(state.username);
            
            // Redirect to feed page
            goto('/feed');
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred saving your username';
        } finally {
            state.loading = false;
        }
    }
    
    // Auto-fill with Reddit username if provided
    $effect(() => {
        if (state.redditUsername && !state.username) {
            state.username = state.redditUsername;
        }
    });
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md">
        <h1 class="form-title text-2xl">Create Your Username</h1>
        <p class="text-gray-600 mb-6">Choose a unique username for your Swiftie profile</p>
        
        {#if state.error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{state.error}</p>
            </div>
        {/if}
        
        <form onsubmit={e => { e.preventDefault(); saveUsername(); }} class="space-y-4">
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <div class="relative">
                    <input
                        id="username"
                        type="text"
                        bind:value={state.username}
                        class="form-input pr-10 {!isUsernameValid && state.username ? 'border-red-500' : ''} {state.isAvailable && state.wasChecked ? 'border-green-500' : ''}"
                        placeholder="Choose a username"
                        required
                    />
                    {#if state.isAvailable && state.wasChecked}
                        <span class="absolute right-3 top-3 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    {/if}
                </div>
                <div class="mt-1">
                    {#if !isUsernameValid && state.username}
                        <p class="text-red-500 text-sm">Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens</p>
                    {:else}
                        <p class="text-gray-500 text-sm">3-20 characters, letters, numbers, underscores, and hyphens only</p>
                    {/if}
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button
                    type="button"
                    onclick={checkUsernameAvailability}
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={!isUsernameValid || state.checking}
                >
                    {state.checking ? 'Checking...' : 'Check Availability'}
                </button>
                
                <button
                    type="submit"
                    class="flex-1 form-button"
                    disabled={!isFormValid || state.loading}
                >
                    {state.loading ? 'Saving...' : 'Continue'}
                </button>
            </div>
        </form>
        
        <div class="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 class="font-medium text-blue-800 mb-2">Pro Tip</h3>
            <p class="text-sm text-blue-700">
                If you have a Reddit account, consider using the same username for easier recognition in the community.
            </p>
        </div>
    </div>
</div>

<style>
    /* Form styling */
    .form-container {
        background-color: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .form-title {
        color: var(--text-color);
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }
    
    .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background-color: white;
        color: var(--text-color);
    }
    
    .form-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
    }
    
    .form-button {
        width: 100%;
        padding: 0.75rem 1rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .form-button:hover:not(:disabled) {
        background-color: var(--primary-color-dark);
    }
    
    .form-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
