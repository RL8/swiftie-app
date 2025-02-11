<script lang="ts">
    import "../app.css";
    import { page } from '$app/stores';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import Layout from '$lib/components/Layout.svelte';
    
    $: showBottomNav = !$page.url.pathname.includes('/albums');
</script>

<Layout>
    <div class:pb-16={showBottomNav}>
        <slot />
    </div>
    {#if showBottomNav}
        <BottomNav />
    {/if}
</Layout>

<style>
    :global(.shimmer) {
        background-size: 200% 100%;
        background-image: linear-gradient(
            110deg,
            #f43f5e 0%,
            #f43f5e 40%,
            #ff6b8b 50%,
            #f43f5e 60%,
            #f43f5e 100%
        );
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
</style>
