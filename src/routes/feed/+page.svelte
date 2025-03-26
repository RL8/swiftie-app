<script lang="ts">
    // Import correct modules for Svelte 5 runes mode
    import { effect } from 'svelte';
    import type { AppContext } from '$lib/context/app.svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import ContextPlaceholder from '$lib/components/ContextPlaceholder.svelte';
    import { getSafeAppContext, getSafeMusicContext, isContextAvailable } from '$lib/utils/context-helpers';
    import { page } from '$app/stores';
    import { goto, invalidate } from '$app/navigation';
    import { supabase } from '$lib/supabase/client';

    // Get data from the server using page store instead of export
    const pageData = $derived($page.data);

    // Use safe context helpers instead of direct context access
    const app = getSafeAppContext();
    const music = getSafeMusicContext();
    
    // Check if contexts are available
    const hasAppContext = $state(isContextAvailable('app'));
    const hasMusicContext = $state(isContextAvailable('music'));
    
    // Check for authentication errors
    const authError = $derived(pageData?.authError);
    
    // Auth state subscription state
    const authStateSubscription = $state(null);
    
    // Auth state change listener using $effect instead of onMount
    $effect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Auth state changed: ${event}`);
            // Only invalidate on actual sign in/out events, NOT on initial session
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                // Invalidate all dependencies that rely on session data
                invalidate('supabase:auth').then(() => {
                    // Force a page reload if necessary
                    window.location.reload();
                });
            }
        });
        
        // Store the subscription
        authStateSubscription = data;
        
        // Cleanup function that runs when the component is destroyed
        return () => {
            if (authStateSubscription?.subscription) {
                authStateSubscription.subscription.unsubscribe();
            }
        };
    });
    
    // Replace onMount with $effect for handling authentication errors and orientation completion
    $effect(() => {
        // Only run this logic if both contexts are available
        if (hasAppContext && hasMusicContext) {
            if (music.selectedAlbums.length === 3 && 
                music.selectedSongsCount >= 9 && 
                !app.state.hasCompletedOrientation) {
                app.completeOrientation();
            }
        }
        
        // If there's an authentication error related to cookies, try to refresh the session
        if (authError && authError.type === 'session_cookie_mismatch') {
            // Wait a moment before attempting to refresh
            setTimeout(async () => {
                try {
                    // Try to refresh the page to restore the session
                    window.location.reload();
                } catch (e) {
                    console.error('Failed to refresh session:', e);
                }
            }, 1000);
        }
    });

    // Use feed items from the server
    const feedItems = $derived(pageData?.feedItems || []);
    
    // Function to handle login redirect
    function handleLogin() {
        goto('/login?redirectTo=/feed');
    }

    function formatTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
</script>

<StandardLayout>
    <svelte:fragment slot="header">
        <Header title="Your Feed" />
    </svelte:fragment>
    
    <div class="feed-page">
        {#if authError}
            <div class="auth-error-container" in:fade={{duration: 300}}>
                <div class="auth-error-card">
                    <h2>Authentication Issue</h2>
                    <p>{authError.message}</p>
                    
                    {#if authError.type === 'session_cookie_mismatch'}
                        <p>Trying to restore your session...</p>
                        <div class="loading-spinner"></div>
                    {:else}
                        <button 
                            class="login-button"
                            onclick={handleLogin}
                        >
                            Sign In
                        </button>
                    {/if}
                </div>
            </div>
        {:else if !hasAppContext || !hasMusicContext}
            <div class="placeholders-container">
                <ContextPlaceholder 
                    contextName="app" 
                    actionUrl="/albums" 
                    actionText="Set Up Your Profile" 
                    customMessage={!hasAppContext && !hasMusicContext ? 
                        "App settings and music preferences not available. Complete the music selection process to personalize your feed." :
                        !hasAppContext ? 
                            "App settings not available. Some features may be limited." :
                            "Music preferences not available. Complete the music selection process to personalize your feed."}
                />
            </div>
        {/if}
        
        <div class="feed-container">
            <div class="welcome-card" in:fly={{y: 20, duration: 400}}>
                <h2>Welcome, Swiftie!</h2>
                <p>
                    {#if music.selectedAlbums.length > 0}
                        Based on your album selections, we think you'll love these activities and updates.
                    {:else}
                        Discover Taylor Swift content, create lists, and connect with other fans.
                    {/if}
                </p>
            </div>

            {#each feedItems as item, i (item.id)}
                <div class="feed-item" in:fly={{y: 20, duration: 400, delay: 200 + (i * 100)}}>
                    {#if item.type === 'welcome'}
                        <div class="welcome-item">
                            <div class="item-icon">📣</div>
                            <div class="item-content">
                                <p>{item.content}</p>
                                <span class="timestamp">{formatTime(item.timestamp)}</span>
                            </div>
                        </div>
                    {:else if item.type === 'activity'}
                        <div class="activity-item">
                            <div class="item-icon">👤</div>
                            <div class="item-content">
                                <p><span class="username">{item.user}</span> {item.action}</p>
                                <p class="content-preview">"{item.content}"</p>
                                <span class="timestamp">{formatTime(item.timestamp)}</span>
                            </div>
                        </div>
                    {:else if item.type === 'suggestion'}
                        <div class="suggestion-item">
                            <div class="item-icon">💡</div>
                            <div class="item-content">
                                <p>{item.content}</p>
                                <span class="timestamp">{formatTime(item.timestamp)}</span>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}

            {#if feedItems.length === 0 && !authError}
                <div class="empty-feed" in:fade={{duration: 300}}>
                    <p>No updates yet. Check back soon!</p>
                </div>
            {/if}
        </div>
    </div>
</StandardLayout>

<style>
    .feed-page {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .feed-container {
        padding: var(--dynamic-spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--dynamic-spacing-md);
        overflow-y: auto;
        flex: 1;
    }
    
    .welcome-card {
        background-color: var(--color-primary-alpha);
        border-radius: var(--radius-lg);
        padding: var(--dynamic-spacing-md);
        color: var(--text-primary);
        box-shadow: var(--shadow-sm);
    }
    
    .welcome-card h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
    }
    
    .welcome-card p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .feed-item {
        background-color: white;
        border-radius: var(--radius-lg);
        padding: var(--dynamic-spacing-md);
        box-shadow: var(--shadow-sm);
    }
    
    .welcome-item,
    .activity-item,
    .suggestion-item {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .item-icon {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-gradient-start);
        border-radius: 50%;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .item-content {
        flex: 1;
    }
    
    .item-content p {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .username {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .content-preview {
        font-style: italic;
        color: var(--text-secondary);
    }
    
    .timestamp {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    
    .empty-feed {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    
    .placeholders-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .auth-error-container {
        max-width: 600px;
        margin: 2rem auto;
    }
    
    .auth-error-card {
        background-color: #fff;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    .auth-error-card h2 {
        color: #e74c3c;
        margin-top: 0;
    }
    
    .login-button {
        background-color: #6741d9;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.2s;
    }
    
    .login-button:hover {
        background-color: #5a36c0;
    }
    
    .loading-spinner {
        margin: 1rem auto;
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0,0,0,0.1);
        border-radius: 50%;
        border-top-color: #6741d9;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>