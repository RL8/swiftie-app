<script lang="ts">
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';

    function startGame() {
        // TODO: Implement game start logic
        console.log('Starting game...');
    }
</script>

<StandardLayout>
    <Header 
        slot="header"
        title="Taylor Swift Games"
        subtitle="Test your Swiftie knowledge" />

    <main slot="main" class="container-responsive">
        <div class="grid-responsive gap-dynamic">
            <div class="game-card">
                <div class="game-content">
                    <div class="game-icon">🎵</div>
                    <div class="game-info">
                        <h3>Song Match</h3>
                        <p>Match lyrics with the correct song title</p>
                    </div>
                </div>
                <Button 
                    variant="secondary"
                    size="compact"
                    fullWidth={true}
                    on:click={() => startGame()}
                >
                    Play Now
                </Button>
            </div>

            <div class="game-card">
                <div class="game-content">
                    <div class="game-icon">🎸</div>
                    <div class="game-info">
                        <h3>Era Quiz</h3>
                        <p>Test your knowledge of Taylor's eras</p>
                    </div>
                </div>
                <Button 
                    variant="secondary"
                    size="compact"
                    fullWidth={true}
                    on:click={() => startGame()}
                >
                    Start Game
                </Button>
            </div>

            <div class="game-card">
                <div class="game-content">
                    <div class="game-icon">📝</div>
                    <div class="game-info">
                        <h3>Lyric Challenge</h3>
                        <p>Complete the missing lyrics</p>
                    </div>
                </div>
                <Button 
                    variant="secondary"
                    size="compact"
                    fullWidth={true}
                    on:click={() => startGame()}
                >
                    Begin
                </Button>
            </div>
        </div>
    </main>

    <Footer slot="footer" variant="button">
        <Button variant="primary" on:click={() => startGame()}>
            Start Game
        </Button>
    </Footer>
</StandardLayout>

<style>
    .game-card {
        background: var(--bg-overlay);
        border-radius: var(--radius-card);
        padding: var(--spacing-card);
        backdrop-filter: var(--blur-md);
        display: flex;
        flex-direction: column;
        gap: var(--dynamic-spacing-sm);
    }

    .game-content {
        display: flex;
        align-items: center;
        gap: var(--dynamic-spacing-sm);
        padding-bottom: var(--dynamic-spacing-sm);
    }

    .game-icon {
        background: var(--bg-gradient-start);
        width: clamp(3rem, 8vw, 3.5rem);
        height: clamp(3rem, 8vw, 3.5rem);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(1.5rem, 4vw, 1.75rem);
    }

    .game-info {
        flex: 1;
    }

    .game-info h3 {
        font-size: clamp(1rem, 3vw, 1.25rem);
        font-weight: 600;
        color: var(--text-dark);
        margin: 0;
    }

    .game-info p {
        color: var(--text-secondary);
        margin: var(--dynamic-spacing-sm) 0 0 0;
        font-size: clamp(0.75rem, 2vw, 0.875rem);
    }
</style>
