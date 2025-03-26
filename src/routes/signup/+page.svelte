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
        success: false,
        error: null as string | null
    });
    
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
                password: state.password,
                options: {
                    emailRedirectTo: `${location.origin}/create-username`
                }
            });
            
            if (error) throw error;
            
            // Show success message
            state.success = true;
        } catch (err) {
            state.error = err instanceof Error ? err.message : 'An error occurred during sign up';
        } finally {
            state.loading = false;
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md">
        <h1 class="form-title text-2xl">Create your Swiftie Account</h1>
        
        {#if state.success}
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p class="font-medium">Check your email!</p>
                <p class="text-sm mt-1">We've sent you a confirmation link. Once verified, you'll be able to create your username and start using the app.</p>
            </div>
        {:else}
            {#if state.error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{state.error}</p>
                </div>
            {/if}
            
            <form onsubmit={e => { e.preventDefault(); handleSignUp(); }} class="space-y-4">
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
                    {#if !isEmailValid && state.email}
                        <p class="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        autocomplete="new-password"
                        bind:value={state.password}
                        class="form-input"
                        placeholder="••••••••"
                        required
                    />
                    {#if !isPasswordValid && state.password}
                        <p class="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
                    {/if}
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        autocomplete="new-password"
                        bind:value={state.confirmPassword}
                        class="form-input"
                        placeholder="••••••••"
                        required
                    />
                    {#if !passwordsMatch && state.confirmPassword}
                        <p class="text-red-500 text-sm mt-1">Passwords do not match</p>
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
        {/if}
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                Already have an account?
                <a href="/login" class="form-link">Sign in</a>
            </p>
        </div>
    </div>
</div>
