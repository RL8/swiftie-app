<script lang="ts">
    import { getContext } from 'svelte';
    import type { UserProfileContext } from '$lib/context/user.svelte';
    import { page } from '$app/stores';
    
    // Get user context function but don't invoke it immediately
    const getUserContext = getContext<() => UserProfileContext>('user');
    
    // Current path for active link styling
    const path = $derived($page.url.pathname);
    
    // Define the navigation link type
    interface NavLink {
        href: string;
        label: string;
        icon: string;
    }
    
    // Navigation links with proper typing
    const links = $state<NavLink[]>([
        { href: '/', label: 'Home', icon: '🏠' }
    ]);
    
    // Update links based on auth state
    $effect(() => {
        // Get the user context when needed
        const user = getUserContext();
        
        // Clear existing additional links
        links.splice(1);
        
        const profileState = user.getProfileState();
        
        // Show authenticated links if the user is in any authenticated state (free or premium)
        if (profileState !== 'unregistered') {
            // Links for authenticated users
            links.push(
                { href: '/feed', label: 'Feed', icon: '📱' },
                { href: '/albums', label: 'Albums', icon: '💿' },
                { href: '/profile', label: 'Profile', icon: '👤' }
            );
        } else {
            // Links for non-authenticated users
            links.push(
                { href: '/login', label: 'Sign In', icon: '🔑' }
                // Sign Up link removed - only available on share page
            );
        }
    });
</script>

<nav class="bg-white/80 backdrop-blur-sm fixed bottom-0 left-0 right-0 shadow-lg rounded-t-xl z-10">
    <div class="max-w-md mx-auto px-4">
        <ul class="flex justify-between py-2">
            {#each links as link}
                <li>
                    <a 
                        href={link.href} 
                        class="flex flex-col items-center p-2 rounded-md {path === link.href ? 'text-rose-600' : 'text-gray-600'} hover:text-rose-600 transition-colors"
                    >
                        <span class="text-xl mb-1">{link.icon}</span>
                        <span class="text-xs">{link.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</nav>
