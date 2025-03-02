<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import { setContext } from 'svelte';
    import { base } from '$app/paths';
    import { createMusicContext } from '$lib/context/music.svelte';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    
    // First, create the context
    const musicContext = $state(createMusicContext());
    
    // Then set the context for child components
    $effect(() => {
        setContext('music', () => musicContext);
    });
    
    // Determine if bottom nav should be shown based on path
    const hideBottomNav = $derived(
        ['/albums', '/auth', '/list-keeper', '/profile/edit']
            .some(path => $page.url.pathname.startsWith(path))
    );
</script>

<StandardLayout>
    <div class:pb-16={!hideBottomNav}>
        <slot />
    </div>
    
    {#if !hideBottomNav}
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