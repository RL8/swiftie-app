<script lang="ts">
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import BottomNav from '$lib/components/BottomNav.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';

    interface NavItem {
        path: string;
        label: string;
        icon: string; // Consider using a Svelte component for icons
    }

    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const navItems: NavItem[] = [
        { path: `${base}/feed`, label: 'Feed', icon: 'FeedIcon' }, // Replace 'FeedIcon' with actual component or SVG path
        { path: `${base}/swiftivities`, label: 'Swiftivities', icon: 'SwiftivitiesIcon' }, // Same here
        { path: `${base}/profile`, label: 'Profile', icon: 'ProfileIcon' }, // And here
        { path: `${base}/settings`, label: 'Settings', icon: 'SettingsIcon' }
    ];

    let currentPath = $derived($page.url.pathname);
    let currentPathWithoutBase = $derived(currentPath.replace(base, ''));
</script>

<StandardLayout showHeader={true} showFooter={true}>
    <svelte:fragment slot="header">
        <!-- Your header content here -->
    </svelte:fragment>

    <svelte:fragment slot="main">
        <div class="flex-1 overflow-y-auto relative scrollbar-taylor">
            {@render children?.()}
        </div>
    </svelte:fragment>

    <svelte:fragment slot="footer">
        <nav class="bottom-nav">
            <div class="nav-items">
                {#each navItems as { path, label, icon }}
                    <a
                        href={path}
                        class="nav-item {currentPathWithoutBase === path.replace(base, '') ? 'active' : ''}"
                        data-sveltekit-preload-data="hover"
                    >
                        <span class="nav-label">{label}</span>
                    </a>
                {/each}
            </div>
        </nav>
    </svelte:fragment>
</StandardLayout>

<style>
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--bg-light);
        border-top: 1px solid var(--bg-gradient-end);
        height: var(--footer-height);
        max-width: var(--container-max-width);
        margin: 0 auto;
        z-index: var(--z-footer);
        backdrop-filter: var(--blur-sm);
    }

    .nav-items {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        padding: 0 var(--spacing-footer);
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        text-decoration: none;
        transition: color var(--duration-fast) var(--timing-function);
        position: relative;
        padding: var(--space-2);
    }

    .nav-item:before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: var(--radius-full);
        background: currentColor;
        opacity: 0;
        transition: opacity var(--duration-fast) var(--timing-function);
    }

    .nav-item:active:before {
        opacity: 0.1;
    }

    .nav-item.active {
        color: var(--color-primary);
    }

    .nav-label {
        font-size: 0.75rem;
        margin-top: var(--space-1);
    }
</style>