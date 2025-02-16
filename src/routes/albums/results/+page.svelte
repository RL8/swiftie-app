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

    const music = getContext<MusicContext>('music');

    function handleStartOver() {
        goto(`${base}/albums`);
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
                                <div class="vinyl">
                                    <img
                                        src={music.selectedAlbums[2].coverArt}
                                        alt={music.selectedAlbums[2].title}
                                        class="vinyl-art"
                                    />
                                    <div class="vinyl-grooves"></div>
                                    <div class="vinyl-center">
                                        <div class="rank-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>
                                            <span class="rank-number">3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="song-list">
                                <h3 class="album-title">{music.selectedAlbums[2].title}</h3>
                                <ul class="songs">
                                    {#each music.selectedSongs.filter(song => song.albumId === music.selectedAlbums[2].id) as song}
                                        <li class="song-item">{song.title}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum2}
                    <div class="vinyl-card vinyl-2"
                        on:touchstart={vibrate}>
                        <div class="vinyl-content">
                            <div class="vinyl-image">
                                <div class="vinyl">
                                    <img
                                        src={music.selectedAlbums[1].coverArt}
                                        alt={music.selectedAlbums[1].title}
                                        class="vinyl-art"
                                    />
                                    <div class="vinyl-grooves"></div>
                                    <div class="vinyl-center">
                                        <div class="rank-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>
                                            <span class="rank-number">2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="song-list">
                                <h3 class="album-title">{music.selectedAlbums[1].title}</h3>
                                <ul class="songs">
                                    {#each music.selectedSongs.filter(song => song.albumId === music.selectedAlbums[1].id) as song}
                                        <li class="song-item">{song.title}</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </div>
                {/if}
                
                {#if showAlbum1}
                    <div class="vinyl-card vinyl-1"
                        on:touchstart={vibrate}>
                        <div class="vinyl-content">
                            <div class="vinyl-image">
                                <div class="vinyl">
                                    <img
                                        src={music.selectedAlbums[0].coverArt}
                                        alt={music.selectedAlbums[0].title}
                                        class="vinyl-art"
                                    />
                                    <div class="vinyl-grooves"></div>
                                    <div class="vinyl-center">
                                        <div class="rank-badge">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                            </svg>
                                            <span class="rank-number">1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="song-list">
                                <h3 class="album-title">{music.selectedAlbums[0].title}</h3>
                                <ul class="songs">
                                    {#each music.selectedSongs.filter(song => song.albumId === music.selectedAlbums[0].id) as song}
                                        <li class="song-item">{song.title}</li>
                                    {/each}
                                </ul>
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
                on:click={handleStartOver}
                fullWidth={true}>
                Start Over
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
        width: 360px;
        height: 488px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vinyl-card {
        position: absolute;
        left: 0;
        transition: transform 0.3s ease;
        width: 360px;
        height: 144px;
        padding: 1rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .vinyl-1 {
        top: 0;
        z-index: 3;
        animation: slideInOne 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .vinyl-2 {
        top: 160px;
        z-index: 2;
        animation: slideInTwo 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .vinyl-3 {
        top: 320px;
        z-index: 1;
        animation: slideInThree 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideInOne {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInTwo {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInThree {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .vinyl-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .vinyl-image {
        position: relative;
        width: 112px;
        height: 112px;
    }

    .vinyl {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #000;
        overflow: hidden;
        box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        animation: spin 20s linear infinite;
    }

    .vinyl-art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .vinyl-grooves {
        position: absolute;
        inset: 0;
        background: repeating-radial-gradient(
            circle at center,
            transparent 0,
            transparent 3px,
            rgba(255, 255, 255, 0.05) 3.5px,
            rgba(0, 0, 0, 0.15) 4px
        );
        mix-blend-mode: overlay;
        z-index: 2;
        pointer-events: none;
        opacity: 0.85;
    }

    .vinyl-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40%;
        height: 40%;
        background: radial-gradient(
            circle at center,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.9) 50%,
            #000 100%
        );
        border-radius: 50%;
        z-index: 4;
        box-shadow: 
            0 0 0 2px rgba(255, 255, 255, 0.1),
            inset 0 0 0 2px rgba(0, 0, 0, 0.4);
        overflow: hidden;
    }

    .vinyl-center::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
        height: 15%;
        background: rgb(226, 232, 240);
        border-radius: 50%;
        box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.2);
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .rank-badge {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FF69B4;
        z-index: 5;
    }

    .heart-icon {
        position: absolute;
        width: 200%;
        height: 200%;
        left: -50%;
        top: -50%;
    }

    .rank-number {
        position: relative;
        z-index: 1;
        font-weight: bold;
        color: white;
        font-size: 1rem;
        text-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
    }

    .song-list {
        flex: 1;
    }

    .album-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 0.5rem;
    }

    .songs {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .song-item {
        font-size: 0.75rem;
        color: #4a4a4a;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
