<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import { setContext } from 'svelte';
    import { base } from '$app/paths';
    import { createMusicContext } from '$lib/context/music.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    
    // First, create the context
    const musicContext = $state(createMusicContext());
    
    // Then set the context for child components
    $effect(() => {
        setContext('music', () => musicContext);
    });
</script>

<StandardLayout>
    <div>
        <slot />
    </div>
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