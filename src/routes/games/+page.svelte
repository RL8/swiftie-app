<script lang="ts">
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import BaseHeader from '$lib/components/layout/HeaderVariants/BaseHeader.svelte';
    import ButtonFooter from '$lib/components/layout/FooterVariants/ButtonFooter.svelte';
    import Button from '$lib/components/Button/Button.svelte';
</script>

<StandardLayout>
    <BaseHeader 
        slot="header"
        title="Games & Activities"
        subtitle="Fun ways to explore Taylor's music"
    />

    <div class="p-6 space-y-6">
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
            >
                Begin
            </Button>
        </div>
    </div>
</StandardLayout>

<style>
    .game-card {
        background: white;
        border-radius: 1.25rem;
        padding: 1.25rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .game-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-bottom: 0.5rem;
    }

    .game-icon {
        background: #FFF1F5;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
    }

    .game-info {
        flex: 1;
    }

    .game-info h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1F2937;
        margin: 0;
    }

    .game-info p {
        color: #6B7280;
        margin: 0.25rem 0 0 0;
        font-size: 0.875rem;
    }
</style>
