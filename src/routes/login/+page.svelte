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
    
    async function handleGoogleLogin() {
        state.loading = true;
        state.error = null;
        
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`
                }
            });
            
            if (error) throw error;
            
            // Redirect will be handled automatically by Supabase
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred';
            state.loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md">
        <h1 class="form-title text-2xl">Sign in to Swiftie App</h1>
        
        {#if state.error}
            <div class="form-error bg-opacity-10 border border-opacity-20 px-4 py-3 rounded mb-4">
                {state.error}
            </div>
        {/if}
        
        <form 
            onsubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }} 
            class="space-y-4"
        >
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                    id="email"
                    type="email" 
                    bind:value={state.email}
                    required
                    class="form-input"
                />
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input 
                    id="password"
                    type="password" 
                    bind:value={state.password}
                    required
                    class="form-input"
                />
            </div>
            
            <button 
                type="submit" 
                class="form-button"
                disabled={state.loading}
            >
                {state.loading ? 'Loading...' : 'Sign In'}
            </button>
        </form>
        
        <div class="form-divider">
            <span class="form-divider-text">Or continue with</span>
        </div>
        
        <button 
            type="button"
            onclick={handleGoogleLogin}
            class="form-button-secondary mt-4"
            disabled={state.loading}
        >
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M23.6945,12.2727c0,-0.7636 -0.0682,-1.5 -0.1909,-2.2091l-11.5036,0l0,4.1864l6.5864,0c-0.2864,1.5409 -1.1455,2.8455 -2.4409,3.7182l0,3.0818l3.9409,0c2.3045,-2.1227 3.6082,-5.25 3.6082,-8.7773Z" fill="#4285F4"></path>
                    <path d="M12,24c3.2864,0 6.0409,-1.0773 8.0454,-2.9182l-3.9409,-3.0818c-1.0909,0.7364 -2.4863,1.1727 -4.1045,1.1727c-3.1636,0 -5.8364,-2.1409 -6.7909,-5.0182l-4.0636,0l0,3.1773c1.9909,3.9545 6.0954,6.6682 10.8545,6.6682Z" fill="#34A853"></path>
                    <path d="M5.2091,14.1545c-0.2455,-0.7364 -0.3864,-1.5136 -0.3864,-2.3182c0,-0.8045 0.1409,-1.5818 0.3864,-2.3181l0,-3.1773l-4.0636,0c-0.8182,1.6363 -1.2955,3.4909 -1.2955,5.4954c0,2.0046 0.4773,3.8591 1.2955,5.4955l4.0636,-3.1773Z" fill="#FBBC05"></path>
                    <path d="M12,4.9091c1.7818,0 3.3818,0.6136 4.6409,1.8182l3.4954,-3.4955c-2.1,-1.9636 -4.8409,-3.1591 -8.1363,-3.1591c-4.7591,0 -8.8636,2.7137 -10.8545,6.6682l4.0636,3.1773c0.9545,-2.8773 3.6273,-5.0091 6.7909,-5.0091Z" fill="#EA4335"></path>
                </g>
            </svg>
            Google
        </button>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Don't have an account? 
                <a href="/register" class="form-link">Sign up</a>
            </p>
        </div>
    </div>
</div>
