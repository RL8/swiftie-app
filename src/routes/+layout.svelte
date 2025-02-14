<script lang="ts">
    import { base } from '$app/paths';
    import "../app.css";
    import { page } from '$app/stores';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    
    $: showBottomNav = !$page.url.pathname.includes('/albums');
</script>

<StandardLayout>
    <div class:pb-16={showBottomNav}>
        <slot />
    </div>
    {#if showBottomNav}
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
