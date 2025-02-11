<script lang="ts">
    import PageHeader from '$lib/components/PageHeader.svelte';
    import Button from '$lib/components/Button.svelte';
</script>

<PageHeader 
    title="Your Profile" 
    subtitle="Customize your Swiftie experience" 
/>

<main class="flex-1 overflow-y-auto py-4">
    <div class="px-4 space-y-6">
        <div class="flex items-center justify-center">
            <div class="w-24 h-24 bg-rose-200 rounded-full flex items-center justify-center">
                <span class="text-3xl text-rose-600">🎵</span>
            </div>
        </div>

        <div class="space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <h3 class="text-lg font-semibold text-rose-800 mb-2">Stats</h3>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold text-rose-600">0</div>
                        <div class="text-sm text-rose-700">Games</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-rose-600">0</div>
                        <div class="text-sm text-rose-700">Matches</div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-rose-600">0</div>
                        <div class="text-sm text-rose-700">Points</div>
                    </div>
                </div>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <h3 class="text-lg font-semibold text-rose-800 mb-2">Settings</h3>
                <div class="space-y-4">
                    <Button variant="secondary">
                        Edit Profile
                    </Button>
                    <Button variant="secondary">
                        Notification Preferences
                    </Button>
                    <Button variant="secondary">
                        Privacy Settings
                    </Button>
                </div>
            </div>
        </div>
    </div>
</main>
