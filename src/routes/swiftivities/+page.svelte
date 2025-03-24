<script lang="ts">
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { fly } from 'svelte/transition';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import ContextPlaceholder from '$lib/components/ContextPlaceholder.svelte';
    import { getSafeAppContext, isContextAvailable } from '$lib/utils/context-helpers';

    // Use safe context helper instead of direct context access
    const app = getSafeAppContext();
    
    // Check if context is available
    const hasAppContext = $state(isContextAvailable('app'));

    // Activity types for the Swiftivities section
    const activities = [
        {
            id: 'list-keeper',
            title: 'List Keeper',
            description: 'Create and share ranked lists of albums, songs, and more',
            icon: '📋',
            color: '#F4E5B2', // Fearless yellow
            path: `${base}/list-keeper`
        },
        {
            id: 'musings',
            title: 'Musings',
            description: 'Share your thoughts on lyrics, themes, and eras',
            icon: '💭',
            color: '#D1A0A2', // Speak Now purple-pink
            path: `${base}/musings`
        },
        {
            id: 'besties',
            title: 'Besties',
            description: 'Find and connect with Swifties who share your taste',
            icon: '👯',
            color: '#E8C1E1', // Lover pink
            path: `${base}/besties`
        },
        {
            id: 'frenemies',
            title: 'Frenemies',
            description: 'Debate with those who have completely different opinions',
            icon: '🔥',
            color: '#B02428', // Red red
            path: `${base}/frenemies`
        }
    ];

    function navigateToActivity(path: string) {
        goto(path);
    }
</script>

<StandardLayout>
    <svelte:fragment slot="header">
        <Header title="Swiftivities" subtitle="Fun Taylor-inspired activities" />
    </svelte:fragment>
    
    {#if !hasAppContext}
        <div class="context-warning">
            <ContextPlaceholder 
                contextName="app"
                actionUrl="/"
                actionText="Return to Home"
                customMessage="App settings not available. Some features may be limited. Try returning to the home page to initialize the app properly."
            />
        </div>
    {/if}
    
    <div class="swiftivities-page">
        <main class="activities-container">
            {#each activities as activity, i}
                <div 
                    class="activity-card" 
                    style="background-color: {activity.color}36;" 
                    in:fly={{y: 20, duration: 400, delay: i * 100}}
                    on:click={() => navigateToActivity(activity.path)}
                >
                    <div class="activity-icon" style="background-color: {activity.color};">
                        <span>{activity.icon}</span>
                    </div>
                    <div class="activity-content">
                        <h3>{activity.title}</h3>
                        <p>{activity.description}</p>
                    </div>
                </div>
            {/each}
        </main>

        <Footer>
            <p class="footer-text">
                More activities coming soon!
            </p>
        </Footer>
    </div>
</StandardLayout>

<style>
    .swiftivities-page {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .activities-container {
        padding: var(--dynamic-spacing-md);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--dynamic-spacing-md);
        overflow-y: auto;
        flex: 1;
    }

    .activity-card {
        border-radius: var(--radius-lg);
        padding: var(--dynamic-spacing-md);
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: var(--shadow-sm);
    }

    .activity-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .activity-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .activity-content {
        flex: 1;
    }

    .activity-content h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: var(--text-primary);
    }

    .activity-content p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    .footer-text {
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
    }

    .context-warning {
        margin: 1rem;
    }
</style>