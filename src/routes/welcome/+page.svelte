<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase/client';
    import Header from '$lib/components/layout/Header.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';

    // State for displaying user info and debug data
    const state = $state({
        user: null,
        profile: null,
        loading: true,
        error: null
    });

    onMount(async () => {
        try {
            // Get the current session
            const { data: sessionData } = await supabase.auth.getSession();
            
            if (sessionData?.session?.user) {
                state.user = sessionData.session.user;
                
                // Fetch the user's profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessionData.session.user.id)
                    .single();
                
                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    state.error = 'Could not load your profile data';
                } else {
                    state.profile = profileData;
                }
            } else {
                state.error = 'No active session found';
            }
        } catch (err) {
            console.error('Error in welcome page:', err);
            state.error = err instanceof Error ? err.message : 'An unknown error occurred';
        } finally {
            state.loading = false;
        }
    });

    function navigateTo(path) {
        goto(path);
    }
</script>

<StandardLayout>
    <div class="welcome-container">
        <Header 
            title="Welcome"
            subtitle="You're logged in successfully" />
        
        <main class="content">
            {#if state.loading}
                <div class="loading">
                    <p>Loading your profile data...</p>
                </div>
            {:else if state.error}
                <div class="error-container">
                    <h2>Oops! Something went wrong</h2>
                    <p>{state.error}</p>
                    <button on:click={() => goto('/login')} class="btn-primary">
                        Back to Login
                    </button>
                </div>
            {:else}
                <div class="success-container">
                    <h2>Welcome, {state.profile?.username || state.user?.email}</h2>
                    
                    <div class="user-info">
                        <h3>Your Account</h3>
                        <p><strong>Email:</strong> {state.user?.email}</p>
                        <p><strong>Username:</strong> {state.profile?.username || 'Not set'}</p>
                        <p><strong>Account created:</strong> {new Date(state.user?.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="navigation-options">
                        <h3>Where would you like to go?</h3>
                        <div class="button-group">
                            <button on:click={() => navigateTo('/profile')} class="btn-primary">
                                My Profile
                            </button>
                            <button on:click={() => navigateTo('/feed')} class="btn-secondary">
                                Go to Feed
                            </button>
                        </div>
                    </div>
                </div>
            {/if}
        </main>
    </div>
</StandardLayout>

<style>
    .welcome-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .content {
        flex: 1;
        padding: 1rem;
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
    }
    
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }
    
    .error-container, 
    .success-container {
        background: var(--color-card-bg);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .error-container {
        border-left: 4px solid var(--color-error);
    }
    
    .user-info,
    .navigation-options {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border);
    }
    
    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--color-text-primary);
    }
    
    h3 {
        font-size: 1.2rem;
        margin-bottom: 0.75rem;
        color: var(--color-text-primary);
    }
    
    .btn-primary, 
    .btn-secondary {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-primary {
        background: var(--color-primary);
        color: white;
        border: none;
    }
    
    .btn-secondary {
        background: transparent;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
    }
    
    .btn-primary:hover {
        background: var(--color-primary-dark);
    }
    
    .btn-secondary:hover {
        background: rgba(var(--color-primary-rgb), 0.1);
    }
</style>
