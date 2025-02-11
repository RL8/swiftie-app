<script lang="ts">
    import { selectedAlbums } from '$lib/stores/albumSelection';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import confetti from 'canvas-confetti';

    function handleEdit() {
        goto('/albums');
    }
    
    function handleContinue() {
        goto('/songs');
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
                        origin: { x: 0.2, y: 0.3 },
                        colors: ['#FFB6C1', '#FF69B4', '#FF1493']
                    });
                }, 600); // Longer delay for more impact
            }, 600);
        }, 300);
    });
</script>

<div class="fixed inset-0 bg-slate-200 flex justify-center items-center p-4">
    <div class="bg-gradient-to-br from-rose-50 to-rose-100 flex flex-col w-full max-w-md h-[800px] rounded-3xl overflow-hidden shadow-2xl">
        <header class="w-full bg-rose-50/80 backdrop-blur-sm py-8">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-rose-900 mb-2 animate-celebration">Amazing Choices! 🎉</h1>
                <p class="text-rose-700">Your top 3 Taylor Swift albums</p>
            </div>
        </header>

        <main class="flex-1 flex items-center justify-center">
            <div class="vinyl-container mx-auto">
                {#if mounted}
                    {#if showAlbum3}
                        <div class="vinyl-card vinyl-3"
                            on:touchstart={vibrate}
                        >
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
                                        <span class="rank-number">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    
                    {#if showAlbum2}
                        <div class="vinyl-card vinyl-2"
                            on:touchstart={vibrate}
                        >
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
                                        <span class="rank-number">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                    
                    {#if showAlbum1}
                        <div class="vinyl-card vinyl-1"
                            on:touchstart={vibrate}
                        >
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
                                        <span class="rank-number">1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                {/if}
            </div>
        </main>
        
        <footer class="w-full bg-white/60 backdrop-blur-sm border-t border-rose-100 py-8">
            <div class="max-w-md mx-auto px-4 flex gap-4">
                {#if mounted}
                    <button
                        class="button-secondary flex-1"
                        on:touchstart={vibrate}
                        on:click={handleEdit}
                    >
                        Edit Selection
                    </button>
                    <button
                        class="button-primary subtle-shimmer flex-1"
                        on:touchstart={vibrate}
                        on:click={handleContinue}
                    >
                        Continue to Songs
                    </button>
                {/if}
            </div>
        </footer>
    </div>
</div>

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
        width: 2rem;
        height: 2rem;
        background: rgb(244, 63, 94);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
        animation: pulse 4s ease infinite;
        z-index: 10;
    }

    .rank-number {
        color: white;
        font-size: 1.75rem;
        font-weight: bold;
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
