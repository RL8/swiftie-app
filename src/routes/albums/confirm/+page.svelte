<script lang="ts">
    import { getContext } from 'svelte';
    import type { MusicContext } from '$lib/context/music.svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import confetti from 'canvas-confetti';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import VinylRecord from '$lib/components/music/VinylRecord.svelte';
    import { page } from '$app/stores';

    const music = getContext<() => MusicContext>('music')();

    function handleEdit() {
        goto(`${base}/albums`);
    }
    
    function handleContinue() {
        if (music.selectedAlbums.length === 3) {
            goto(`${base}/albums/songs`);
        }
    }

    function vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    let mounted = $state(false);
    let showAlbum3 = $state(false);
    let showAlbum2 = $state(false);
    let showAlbum1 = $state(false);

    onMount(() => {
        mounted = true;
        
        // Start animation sequence after a short delay
        setTimeout(() => {
            showAlbum3 = true;
            
            setTimeout(() => {
                showAlbum2 = true;
                
                setTimeout(() => {
                    showAlbum1 = true;
                    // Trigger confetti when album 1 appears
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6, x: 0.5 },
                    });
                    
                    // Check if this is a quick share flow
                    const isQuickShare = $page.url.searchParams.get('quick-share') === 'true';
                    if (isQuickShare) {
                        // If quick share, automatically continue to songs page after animation
                        setTimeout(() => {
                            goto(`${base}/albums/songs?quick-share=true`);
                        }, 1500);
                    }
                }, 300);
            }, 300);
        }, 300);
    });
</script>

<StandardLayout>
    {#snippet header()}
        <Header
            
            title="Amazing Choices! 🎉"
            subtitle="Your top 3 Taylor Swift albums" />
    {/snippet}

    <div class="flex-1 p-6">
        <div class="vinyl-container mx-auto">
            {#if mounted}
                {#if showAlbum3}
                    <div class="vinyl-card vinyl-3"
                        ontouchstart={vibrate}>
                        <div class="vinyl-content">
                            <span class="rank-number" style="color: {music.selectedAlbums[2].color}">3</span>
                            <VinylRecord
                                coverArt={music.selectedAlbums[2].coverArt}
                                title={music.selectedAlbums[2].title}
                                selected={true}
                                selectionNumber={3}
                                badgePosition="none"
                                showSelectionOverlay={false}
                                showGrooves={true}
                                class_="confirm-vinyl"
                            />
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum2}
                    <div class="vinyl-card vinyl-2"
                        ontouchstart={vibrate}>
                        <div class="vinyl-content">
                            <span class="rank-number" style="color: {music.selectedAlbums[1].color}">2</span>
                            <VinylRecord
                                coverArt={music.selectedAlbums[1].coverArt}
                                title={music.selectedAlbums[1].title}
                                selected={true}
                                selectionNumber={2}
                                badgePosition="none"
                                showSelectionOverlay={false}
                                showGrooves={true}
                                class_="confirm-vinyl"
                            />
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum1}
                    <div class="vinyl-card vinyl-1"
                        ontouchstart={vibrate}>
                        <div class="vinyl-content">
                            <span class="rank-number" style="color: {music.selectedAlbums[0].color}">1</span>
                            <VinylRecord
                                coverArt={music.selectedAlbums[0].coverArt}
                                title={music.selectedAlbums[0].title}
                                selected={true}
                                selectionNumber={1}
                                badgePosition="none"
                                showSelectionOverlay={false}
                                showGrooves={true}
                                class_="confirm-vinyl"
                            />
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    {#snippet footer()}
        <Footer variant="button" >
            {#if mounted}
                <Button 
                    variant="secondary"
                    on:click={handleEdit}
                    fullWidth={true}>
                    Edit Selection
                </Button>
                <Button 
                    variant="primary"
                    on:click={handleContinue}
                    fullWidth={true}>
                    Continue to Songs
                </Button>
            {/if}
        </Footer>
    {/snippet}
</StandardLayout>

<style>
    .vinyl-container {
        position: relative;
        width: 288px;
        height: 488px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vinyl-card {
        position: absolute;
        left: 0;
        transition: transform 0.3s ease;
    }

    .vinyl-1 {
        top: 0;
        z-index: 3;
        animation: slideInOne 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .vinyl-2 {
        top: 140px;
        left: 40px;
        z-index: 2;
        animation: slideInTwo 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .vinyl-3 {
        top: 280px;
        left: 80px;
        z-index: 1;
        animation: slideInThree 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideInOne {
        from {
            opacity: 0;
            transform: translate(-100%, 0) rotate(-15deg);
        }
        to {
            opacity: 1;
            transform: translate(0, 0);
        }
    }

    @keyframes slideInTwo {
        from {
            opacity: 0;
            transform: translate(-100%, 0) rotate(-15deg);
        }
        to {
            opacity: 1;
            transform: translate(0, 0);
        }
    }

    @keyframes slideInThree {
        from {
            opacity: 0;
            transform: translate(-100%, 0) rotate(-15deg);
        }
        to {
            opacity: 1;
            transform: translate(0, 0);
        }
    }

    .vinyl-content {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .rank-number {
        position: absolute;
        left: -4rem;
        font-size: 4rem;
        font-weight: 800;
        line-height: 1;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3),
                     0 0 20px currentColor;
        font-family: 'Playfair Display', serif;
        letter-spacing: -0.02em;
    }

    :global(.confirm-vinyl) {
        width: 13rem;
        height: 13rem;
    }

    .button-primary {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background: rgb(244, 63, 94);
        color: white;
        border-radius: 0.5rem;
        font-weight: 500;
        transform-origin: center;
        transition: transform 100ms ease;
    }

    .button-secondary {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background: rgb(254, 242, 242);
        color: rgb(244, 63, 94);
        border-radius: 0.5rem;
        font-weight: 500;
        transform-origin: center;
        transition: transform 100ms ease;
    }

    .button-primary:active,
    .button-secondary:active {
        transform: scale(0.98);
    }
</style>
