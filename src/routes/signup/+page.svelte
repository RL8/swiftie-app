<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase/client';
    import { getContext } from 'svelte';
    import type { UserProfileContext } from '$lib/context/user.svelte';
    
    // Get user context function but don't invoke it immediately
    const getUserContext = getContext<() => UserProfileContext>('user');
    
    // Using Svelte 5 runes for state management
    const state = $state({
        email: '',
        password: '',
        confirmPassword: '',
        loading: false,
        error: null as string | null
    });
    
    // Get any redirect URL from the query params
    const redirectTo = $derived(new URLSearchParams($page.url.search).get('redirectTo') || '/feed');
    
    // Form validation
    const passwordsMatch = $derived(state.password === state.confirmPassword);
    const isEmailValid = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email));
    const isPasswordValid = $derived(state.password.length >= 6);
    const isFormValid = $derived(passwordsMatch && isEmailValid && isPasswordValid && state.confirmPassword !== '');
    
    async function handleSignUp() {
        if (!isFormValid) return;
        
        state.loading = true;
        state.error = null;
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: state.email,
                password: state.password
            });
            
            if (error) throw error;
            
            // Get user context when needed
            const user = getUserContext();
            
            // Redirect to the feed page
            goto('/feed');
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred during sign up';
        } finally {
            state.loading = false;
        }
    }
    
    async function handleGoogleSignUp() {
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
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred during Google sign up';
        } finally {
            state.loading = false;
        }
    }
    
    function handleFormSubmit(event: Event) {
        event.preventDefault();
        handleSignUp();
    }
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md">
        <h1 class="form-title text-2xl">Create your Swiftie Account</h1>
        
        {#if state.error}
            <div class="form-error bg-opacity-10 border border-opacity-20 px-4 py-3 rounded mb-4" role="alert">
                <p>{state.error}</p>
            </div>
        {/if}
        
        <form onsubmit={handleFormSubmit} class="space-y-4">
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                    id="email"
                    type="email"
                    bind:value={state.email}
                    class="form-input"
                    required
                />
                {#if state.email && !isEmailValid}
                    <p class="form-error-message">Please enter a valid email address</p>
                {/if}
            </div>
            
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input
                    id="password"
                    type="password"
                    bind:value={state.password}
                    class="form-input"
                    required
                />
                {#if state.password && !isPasswordValid}
                    <p class="form-error-message">Password must be at least 6 characters</p>
                {/if}
            </div>
            
            <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    bind:value={state.confirmPassword}
                    class="form-input"
                    required
                />
                {#if state.confirmPassword && !passwordsMatch}
                    <p class="form-error-message">Passwords do not match</p>
                {/if}
            </div>
            
            <button
                type="submit"
                class="form-button"
                disabled={!isFormValid || state.loading}
            >
                {state.loading ? 'Creating account...' : 'Sign Up'}
            </button>
        </form>
        
        <div class="form-divider">
            <span class="form-divider-text">Or continue with</span>
        </div>
        
        <div class="mt-6">
            <button
                onclick={handleGoogleSignUp}
                class="form-button-secondary"
                disabled={state.loading}
            >
                <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                </svg>
                Sign up with Google
            </button>
        </div>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Already have an account?
                <a href="/login" class="form-link">Sign in</a>
            </p>
        </div>
    </div>
</div>
