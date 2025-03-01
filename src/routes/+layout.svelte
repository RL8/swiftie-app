<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import { setContext } from 'svelte';
    import { createMusicContext } from '$lib/context/music.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import MainAppLayout from '$lib/components/layout/MainAppLayout.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';

    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    // Create and provide the music context
    const musicContext = createMusicContext();
    setContext('music', () => musicContext);

    let hasCompletedOrientation = $state(false);
    let transitioning = $state(false);  // Use this variable for transition class toggle

    // Check for completed orientation (e.g., from local storage)
    onMount(() => {
        if (typeof localStorage !== 'undefined') {
            const completed = localStorage.getItem('orientationCompleted');
            hasCompletedOrientation = completed === 'true';
        }
    });

    $effect(() => {
        if (hasCompletedOrientation && $page.url.pathname.includes('/albums')) {
            transitioning = true; // Start the transition
            setTimeout(() => {
                transitioning = false; // End the transition
                goto('/feed');
            }, 300); // Match the transition duration in CSS
        }
    });
    
    function handleOrientationComplete() {
        hasCompletedOrientation = true;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('orientationCompleted', 'true');
        }
    }
</script>

{#if hasCompletedOrientation && !$page.url.pathname.includes('/albums')}
    <MainAppLayout>
        {@render children?.()}
    </MainAppLayout>
{:else}
    <StandardLayout showFooter={false}>
        <div class:pb-16={!$page.url.pathname.includes('/albums')}>
            {@render children?.()}
        </div>
    </StandardLayout>
{/if}

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

    /* Transition Styles (Example) */
    .standardLayout-enter-active, .mainAppLayout-enter-active {
        transition: opacity var(--duration-fast) var(--timing-function);
    }

    .standardLayout-enter, .mainAppLayout-enter {
        opacity: 0;
    }
</style>