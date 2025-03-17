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

    function handleGetStarted() {
        goto(`${base}/albums`);
    }

    function handleQuickShare() {
        // Navigate to albums page with quick-share parameter
        goto(`${base}/albums?quick-share=true`);
    }
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
                <Button 
                    variant="secondary"
                    on:click={handleQuickShare}>
                    Quick Share
                </Button>
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
</style>
