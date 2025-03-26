<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase/client';
    
    // Using Svelte 5 runes for state management
    const state = $state({
        email: '',
        password: '',
        loading: false,
        error: null as string | null
    });
    
    // Get any redirect URL from the query params
    const redirectTo = $derived(new URLSearchParams($page.url.search).get('redirectTo') || '/feed');
    
    async function handleLogin() {
        state.loading = true;
        state.error = null;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: state.email,
                password: state.password
            });
            
            if (error) throw error;
            
            // Redirect to the intended destination or profile page
            goto(redirectTo);
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred';
        } finally {
            state.loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md">
        <h1 class="form-title text-2xl">Sign in to Swiftie App</h1>
        
        {#if state.error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{state.error}</p>
            </div>
        {/if}
        
        <form onsubmit={e => { e.preventDefault(); handleLogin(); }} class="space-y-4">
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    type="email"
                    autocomplete="email"
                    bind:value={state.email}
                    class="form-input"
                    placeholder="your@email.com"
                    required
                />
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input
                    id="password"
                    type="password"
                    autocomplete="current-password"
                    bind:value={state.password}
                    class="form-input"
                    placeholder="••••••••"
                    required
                />
                <div class="flex justify-end mt-1">
                    <a href="/reset-password" class="text-sm text-purple-600 hover:text-purple-800">Forgot password?</a>
                </div>
            </div>
            
            <button 
                type="submit" 
                class="form-button"
                disabled={state.loading}
            >
                {state.loading ? 'Loading...' : 'Sign In'}
            </button>
        </form>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Don't have an account? 
                <a href="/signup" class="form-link">Sign up</a>
            </p>
        </div>
    </div>
</div>
