<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import { albums } from '$lib/data/albums';

    const music = getContext<MusicContext>('music');

    // State for dropdown menu
    let showDropdown = $state(true);

    function handleGetStarted() {
        goto(`${base}/albums`);
    }

    function handleQuickShare() {
        // Navigate to albums page with quick-share parameter
        goto(`${base}/albums?quick-share=true`);
    }
    
    function handleSunburst() {
        // Navigate to the T3x3 Sunburst demo page
        goto(`${base}/t3x3-sunburst-demo`);
        showDropdown = false;
    }

    function handleT11x3Sunburst() {
        // Navigate to the T11x3 Sunburst demo page
        goto(`${base}/t11x3-sunburst-demo`);
        showDropdown = false;
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const dropdown = document.querySelector('.dropdown-menu');
        const buttonWrapper = document.querySelector('.button-wrapper');
        
        if (dropdown && buttonWrapper && 
            !dropdown.contains(target) && 
            !buttonWrapper.contains(target)) {
            showDropdown = false;
        }
    }

    // Add event listener when component mounts
    $effect(() => {
        document.addEventListener('click', handleClickOutside);
        
        // Cleanup when component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header
            
            title="Taylor Swift Game"
            subtitle="Find your favorite Taylor's songs" />
    {/snippet}

    {#snippet main()}
        <main  class="flex flex-col items-center justify-center h-full p-4">
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-4">Ready to play?</h2>
                <p class="text-lg mb-8">
                    We'll help you discover your favorite Taylor Swift songs by exploring her albums together.
                </p>
            </div>
        </main>
    {/snippet}

    {#snippet footer()}
        <Footer variant="button" >
            <div class="button-container">
                <div class="dropdown-container">
                    <div class="button-wrapper">
                        <Button 
                            variant="secondary"
                            on:click={() => toggleDropdown()}>
                            Features ▾
                        </Button>
                    </div>
                    
                    {#if showDropdown}
                        <div class="dropdown-menu">
                            <div class="dropdown-item" on:click={handleQuickShare}>
                                Quick Share
                            </div>
                            <div class="dropdown-item" on:click={handleSunburst}>
                                T3x3 Sunburst
                            </div>
                            <div class="dropdown-item" on:click={handleT11x3Sunburst}>
                                T11x3 Sunburst
                            </div>
                        </div>
                    {/if}
                </div>
                
                <Button 
                    variant="primary"
                    on:click={handleGetStarted}
                    fullWidth={false}>
                    Get Started
                </Button>
            </div>
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .welcome-title {
        animation: float 6s ease-in-out infinite;
    }

    .vinyl-decoration {
        animation: tilt 10s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes tilt {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
    }

    @keyframes shine {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
    }

    :global(.animate-shine) {
        animation: shine 3s linear infinite;
    }

    /* Using the standardized button-container from forms.css */
    .button-container {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
    }

    /* Dropdown menu styling */
    .dropdown-container {
        position: relative;
    }

    .button-wrapper {
        cursor: pointer;
    }

    .dropdown-menu {
        position: absolute;
        bottom: 100%;
        left: 0;
        margin-bottom: 0.5rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 10;
        min-width: 180px;
    }

    .dropdown-item {
        display: block;
        width: 100%;
        padding: 12px 16px;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .dropdown-item:hover {
        background-color: #f5f5f5;
    }

    .dropdown-item:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
</style>
