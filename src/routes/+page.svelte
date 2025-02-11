<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/Button.svelte';

    function handleGetStarted() {
        goto('/albums');
    }
</script>

<div class="flex flex-col items-center justify-center min-h-full p-6 text-center">
    <div class="welcome-title mb-12">
        <h1 class="text-6xl font-bold text-rose-600 mb-2">Swiftie</h1>
        <div class="text-2xl font-medium bg-gradient-to-r from-rose-600 to-rose-400 text-transparent bg-clip-text">
            Mix • Match • Magic
        </div>
    </div>

    <div class="vinyl-decoration mb-12">
        <div class="relative w-48 h-48">
            <div class="absolute inset-0 rounded-full bg-black shadow-lg">
                <div class="absolute inset-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-4 h-4 rounded-full bg-rose-500"></div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent animate-shine"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full max-w-xs">
        <Button variant="primary" shimmer={true} on:click={handleGetStarted}>
            Start Your Journey
        </Button>
    </div>
</div>

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
