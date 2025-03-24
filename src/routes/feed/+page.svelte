<script lang="ts">
    import { onMount } from 'svelte';
    import type { AppContext } from '$lib/context/app.svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import ContextPlaceholder from '$lib/components/ContextPlaceholder.svelte';
    import { getSafeAppContext, getSafeMusicContext, isContextAvailable } from '$lib/utils/context-helpers';

    // Use safe context helpers instead of direct context access
    const app = getSafeAppContext();
    const music = getSafeMusicContext();
    
    // Check if contexts are available
    const hasAppContext = $state(isContextAvailable('app'));
    const hasMusicContext = $state(isContextAvailable('music'));
    
    // When the feed is accessed after completing orientation
    // mark the orientation as complete in the app context
    onMount(() => {
        // Only run this logic if both contexts are available
        if (hasAppContext && hasMusicContext) {
            if (music.selectedAlbums.length === 3 && 
                music.selectedSongsCount >= 9 && 
                !app.state.hasCompletedOrientation) {
                app.completeOrientation();
            }
        }
    });

    // Set up feed data
    const feedItems = $state([
        {
            id: 1,
            type: 'welcome',
            timestamp: new Date(),
            content: 'Welcome to your Swiftie feed! Here you\'ll see updates, activities, and content tailored to your favorites.'
        },
        {
            id: 2,
            type: 'activity',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            user: 'TaylorFan2013',
            action: 'created a new list',
            content: 'Top 10 Taylor Swift Bridges'
        },
        {
            id: 3,
            type: 'suggestion',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            content: 'Try the List Keeper to create your own custom rankings!'
        }
    ]);

    function formatTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
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
        {#if !hasAppContext || !hasMusicContext}
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

            {#if feedItems.length === 0}
                <div class="empty-feed" in:fade={{duration: 300}}>
                    <p>No updates yet. Check back soon!</p>
                </div>
            {/if}
        </div>
    </div>

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
    </style>
</StandardLayout>