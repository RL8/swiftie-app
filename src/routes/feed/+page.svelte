<script lang="ts">
    // Import correct modules for Svelte 5 runes mode
    // $effect is a built-in rune in Svelte 5 and doesn't need to be imported
    import type { AppContext } from '$lib/context/app.svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    // ContextPlaceholder removed as it's obsolete with authentication suspended
    import { getSafeAppContext, getSafeMusicContext, isContextAvailable } from '$lib/utils/context-helpers';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabase/client';

    // Get data from the server using page store instead of export
    const pageData = $derived($page.data);

    // Use safe context helpers instead of direct context access
    const app = getSafeAppContext();
    const music = getSafeMusicContext();
    
    // Always assume contexts are available since authentication is suspended
    const hasAppContext = $state(true);
    const hasMusicContext = $state(true);
    
    // Replace onMount with $effect for handling orientation completion
    $effect(() => {
        // Only run this logic if both contexts are available
        if (hasAppContext && hasMusicContext) {
            if (music.selectedAlbums.length === 3 && 
                music.selectedSongsCount >= 9 && 
                !app.state.hasCompletedOrientation) {
                app.completeOrientation();
            }
        }
    });

    // Use feed items from the server
    const feedItems = $derived(pageData?.feedItems || []);

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

            {#if feedItems.length === 0}
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
        padding: 1rem;
    }
    
    .feed-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
    }
    
    .welcome-card {
        background-color: var(--color-primary-light);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .welcome-card h2 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: var(--color-primary-dark);
    }
    
    .welcome-card p {
        margin: 0;
        color: var(--color-primary-dark);
    }
    
    .feed-item {
        background-color: white;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .welcome-item, .activity-item, .suggestion-item {
        display: flex;
        gap: 1rem;
    }
    
    .item-icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .item-content {
        flex: 1;
    }
    
    .item-content p {
        margin: 0 0 0.5rem 0;
    }
    
    .content-preview {
        font-style: italic;
        color: #555;
    }
    
    .username {
        font-weight: bold;
        color: var(--color-primary);
    }
    
    .timestamp {
        font-size: 0.8rem;
        color: #777;
    }
    
    .empty-feed {
        text-align: center;
        padding: 2rem;
        color: #777;
    }
</style>