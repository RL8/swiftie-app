<script lang="ts">
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    
    const navItems = [
        { path: `${base}/feed`, label: 'Feed', icon: 'feed' },
        { path: `${base}/swiftivities`, label: 'Swiftivities', icon: 'swiftivities' },
        { path: `${base}/profile`, label: 'Profile', icon: 'profile' },
        { path: `${base}/about`, label: 'About', icon: 'about' }
    ];

    let currentPath = $derived($page.url.pathname);
    let currentPathWithoutBase = $derived(currentPath.replace(base, ''));
</script>

<nav class="bottom-nav">
    <div class="nav-items">
        {#each navItems as { path, label, icon }}
            <a 
                href={path} 
                class="nav-item {currentPathWithoutBase === path.replace(base, '') ? 'active' : ''}"
                data-sveltekit-preload-data="hover"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {#if icon === 'feed'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M9 15L5 11m0 0l4-4m-4 4h14" />
                    {:else if icon === 'swiftivities'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    {:else if icon === 'profile'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    {:else if icon === 'about'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    {/if}
                </svg>
                <span class="nav-label">{label}</span>
            </a>
        {/each}
    </div>
</nav>

<style>
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid var(--bg-gradient-end, rgb(254, 205, 211));
        height: var(--footer-height, 4rem);
        max-width: var(--container-max-width, 448px);
        margin: 0 auto;
        z-index: var(--z-footer, 10);
    }

    .nav-items {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        padding: 0 var(--spacing-footer, 1rem);
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary, rgb(156, 163, 175));
        text-decoration: none;
        transition: color var(--duration-fast, 0.2s) var(--timing-function, ease-out);
        position: relative;
        padding: var(--space-2, 0.5rem);
    }

    .nav-item:before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: var(--radius-full, 9999px);
        background: currentColor;
        opacity: 0;
        transition: opacity var(--duration-fast, 0.2s) var(--timing-function, ease-out);
    }

    .nav-item:active:before {
        opacity: 0.1;
    }

    .nav-item.active {
        color: var(--color-primary, rgb(244, 63, 94));
    }

    .nav-label {
        font-size: 0.75rem;
        margin-top: var(--space-1, 0.25rem);
    }
</style>