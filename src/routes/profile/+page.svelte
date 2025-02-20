<script lang="ts">
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Button from '$lib/components/Button/Button.svelte';
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            
            title="Your Profile"
            subtitle="Customize your Swiftie experience"
        />
    {/snippet}

    <div class="px-4 space-y-6">
        <div class="flex items-center justify-center">
            <div class="w-24 h-24 bg-rose-200 rounded-full flex items-center justify-center">
                <span class="text-3xl text-rose-600">🎵</span>
            </div>
        </div>

        <div class="space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <h3 class="text-lg font-semibold text-rose-800 mb-2">Stats</h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-rose-600">Albums Rated</span>
                        <span class="font-medium">3</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-rose-600">Songs Matched</span>
                        <span class="font-medium">12</span>
                    </div>
                </div>
            </div>

            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <h3 class="text-lg font-semibold text-rose-800 mb-2">Settings</h3>
                <div class="space-y-4">
                    <div>
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" class="form-checkbox text-rose-500">
                            <span class="text-rose-600">Enable Notifications</span>
                        </label>
                    </div>
                    <div>
                        <label class="flex items-center space-x-2">
                            <input type="checkbox" class="form-checkbox text-rose-500" checked>
                            <span class="text-rose-600">Haptic Feedback</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</StandardLayout>
