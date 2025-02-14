<script lang="ts">
    import { selectedAlbums } from '$lib/stores/albums';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import confetti from 'canvas-confetti';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';

    function handleEdit() {
        goto(`${base}/albums`);
    }
    
    function handleContinue() {
        goto(`${base}/songs`);
    }

    function vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    let mounted = false;
    let showAlbum3 = false;
    let showAlbum2 = false;
    let showAlbum1 = false;

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
                        spread: 100,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#FFB6C1', '#FF69B4', '#FF1493'],
                        disableForReducedMotion: true
                    });
                }, 600); // Longer delay for more impact
            }, 600);
        }, 300);
    });
</script>

<StandardLayout>
    <Header
        slot="header"
        title="Amazing Choices! 🎉"
        subtitle="Your top 3 Taylor Swift albums" />

    <div class="flex-1 p-6">
        <div class="vinyl-container mx-auto">
            {#if mounted}
                {#if showAlbum3}
                    <div class="vinyl-card vinyl-3"
                        on:touchstart={vibrate}>
                        <div class="vinyl-content">
                            <div class="vinyl-image">
                                <div class="record-spin">
                                    <img
                                        src={$selectedAlbums[2].coverArt}
                                        alt={$selectedAlbums[2].title}
                                        class="w-full h-full object-cover"
                                    />
                                    <div class="vinyl-overlay" />
                                </div>
                                <div class="rank-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                    <span class="rank-number">3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum2}
                    <div class="vinyl-card vinyl-2"
                        on:touchstart={vibrate}>
                        <div class="vinyl-content">
                            <div class="vinyl-image">
                                <div class="record-spin">
                                    <img
                                        src={$selectedAlbums[1].coverArt}
                                        alt={$selectedAlbums[1].title}
                                        class="w-full h-full object-cover"
                                    />
                                    <div class="vinyl-overlay" />
                                </div>
                                <div class="rank-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                    <span class="rank-number">2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum1}
                    <div class="vinyl-card vinyl-1"
                        on:touchstart={vibrate}>
                        <div class="vinyl-content">
                            <div class="vinyl-image">
                                <div class="record-spin">
                                    <img
                                        src={$selectedAlbums[0].coverArt}
                                        alt={$selectedAlbums[0].title}
                                        class="w-full h-full object-cover"
                                    />
                                    <div class="vinyl-overlay" />
                                </div>
                                <div class="rank-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                    <span class="rank-number">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>

    <Footer variant="button" slot="footer">
        {#if mounted}
            <Button 
                variant="secondary"
                on:click={() => goto(`${base}/albums`)}
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
</StandardLayout>

<style>
    .animate-gradient {
        background-size: 200% 200%;
        animation: gradientShift 20s ease infinite;
    }

    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .animate-celebration {
        animation: celebration 2s ease infinite;
    }

    @keyframes celebration {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }

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
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .vinyl-image {
        position: relative;
        width: 13rem;
        height: 13rem;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    .record-spin {
        width: 100%;
        height: 100%;
        animation: spin 16s linear infinite;
    }

    .vinyl-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 18%,
            rgba(0, 0, 0, 0.1) 20%,
            transparent 22%,
            rgba(0, 0, 0, 0.1) 24%,
            transparent 26%,
            rgba(0, 0, 0, 0.1) 28%,
            transparent 30%,
            rgba(0, 0, 0, 0.1) 32%,
            transparent 34%
        );
        pointer-events: none;
    }

    .rank-badge {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        color: rgb(244, 63, 94);
        animation: pulse 4s ease infinite;
    }

    .heart-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 8px rgba(244, 63, 94, 0.4));
    }

    .rank-number {
        position: relative;
        color: white;
        font-size: 1.75rem;
        font-weight: bold;
        z-index: 11;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
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

    .subtle-shimmer {
        position: relative;
        overflow: hidden;
    }

    .subtle-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
            110deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0) 100%
        );
        animation: subtle-shimmer 2s infinite;
        transform: translateX(-100%);
    }

    @keyframes subtle-shimmer {
        100% {
            transform: translateX(100%);
        }
    }

    .shimmer {
        background: linear-gradient(to right, #eff1f3 8%, #e2e2e2 18%, #eff1f3 33%);
        background-size: 1000px 104px;
        animation: shimmer 3s linear infinite forwards;
        border-radius: 0.5rem;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    @keyframes shimmer {
        0% {
            background-position: -468px 0;
        }
        100% {
            background-position: 468px 0;
        }
    }
</style>
