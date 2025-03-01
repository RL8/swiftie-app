<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import { setContext } from 'svelte';
    import { base } from '$app/paths';
    import { createMusicContext } from '$lib/context/music.svelte';
    import { createAppContext } from '$lib/context/app.svelte';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    // Create and provide the music context
    const musicContext = createMusicContext();
    setContext('music', () => musicContext);
    
    // Create and provide the app context
    const appContext = createAppContext();
    setContext('app', () => appContext);
    
    // Determine if we should show the bottom nav
    // Show it for main app pages, hide it for onboarding
    const isOnboardingPath = $derived(() => {
        return $page.url.pathname.includes('/albums') || $page.url.pathname === `${base}/`;
    });
</script>

<StandardLayout>
    <div class:pb-16={!isOnboardingPath}>
        {@render children?.()}
    </div>
    {#if !isOnboardingPath}
        <BottomNav />
    {/if}
</StandardLayout>

<style>
    :global(html) {
        background-color: rgb(226, 232, 240);
        height: 100%;
    }

    :global(body) {
        height: 100%;
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>