<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';

    const music = getContext<MusicContext>('music');

    function handleStartGame() {
        music.selectRandomAlbumsAndSongs();
        goto(`${base}/albums`);
    }
</script>

<StandardLayout>
    <Header
        slot="header"
        title="Taylor Swift Game"
        subtitle="Find your favorite Taylor's songs" />

    <main slot="main" class="flex flex-col items-center justify-center h-full p-4">
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">Ready to play?</h2>
            <p class="text-lg mb-8">
                We'll help you discover your favorite Taylor Swift songs by exploring her albums together.
            </p>
        </div>
    </main>

    <Footer variant="button" slot="footer">
        <Button 
            variant="primary"
            on:click={handleStartGame}
            fullWidth={true}>
            Start Game
        </Button>
    </Footer>
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
</style>
