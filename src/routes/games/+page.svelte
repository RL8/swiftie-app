<script lang="ts">
    import PageHeader from '$lib/components/PageHeader.svelte';
    import Button from '$lib/components/Button.svelte';
</script>

<PageHeader 
    title="Games & Activities" 
    subtitle="Fun ways to explore Taylor's music" 
/>

<main class="flex-1 overflow-y-auto py-4">
    <div class="px-4 space-y-4">
        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <h3 class="text-lg font-semibold text-rose-800 mb-2">Song Match</h3>
            <p class="text-rose-600 mb-4">Match lyrics with the correct song title</p>
            <Button variant="primary" shimmer={true}>
                Play Now
            </Button>
        </div>

        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <h3 class="text-lg font-semibold text-rose-800 mb-2">Era Quiz</h3>
            <p class="text-rose-600 mb-4">Test your knowledge of Taylor's eras</p>
            <Button variant="primary">
                Coming Soon
            </Button>
        </div>

        <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
            <h3 class="text-lg font-semibold text-rose-800 mb-2">Lyric Challenge</h3>
            <p class="text-rose-600 mb-4">Complete the missing lyrics</p>
            <Button variant="primary">
                Coming Soon
            </Button>
        </div>
    </div>
</main>
