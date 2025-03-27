<script lang="ts">
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    
    // Define navigation items using typed runes
    const navItems = $state([
        { 
            path: `${base}/feed`, 
            label: 'Feed', 
            icon: '📜',
            ariaLabel: 'Feed page' 
        },
        { 
            path: `${base}/swiftivities`, 
            label: 'Swiftivities', 
            icon: '✨',
            ariaLabel: 'Swiftivities page' 
        },
        { 
            path: `${base}/settings`, 
            label: 'Settings', 
            icon: '⚙️',
            ariaLabel: 'Settings page' 
        },
        { 
            path: `${base}/profile`, 
            label: 'Profile', 
            icon: '🎵',
            ariaLabel: 'Profile page' 
        }
    ]);

    // Derived state for current path
    let currentPath = $derived($page.url.pathname);
    let currentPathWithoutBase = $derived(currentPath.replace(base, ''));
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 max-w-md mx-auto" aria-label="Main navigation">
    <div class="flex justify-around items-center">
        {#each navItems as { path, label, icon, ariaLabel }}
            <a 
                href={path} 
                class="flex flex-col items-center p-2 {currentPathWithoutBase === path.replace(base, '') ? 'text-rose-600' : 'text-gray-600'}"
                aria-label={ariaLabel}
                aria-current={currentPathWithoutBase === path.replace(base, '') ? 'page' : undefined}
            >
                <span class="text-2xl" aria-hidden="true">{icon}</span>
                <span class="text-xs mt-1">{label}</span>
            </a>
        {/each}
    </div>
</nav>