<script lang="ts">
    import { page } from '$app/stores';
    
    // Get data from server
    const data = $props();
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h1 class="text-2xl font-bold text-center text-gray-800">
            {#if data.error}
                Authentication Error
            {:else}
                Completing Authentication...
            {/if}
        </h1>
        
        {#if data.error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{data.error}</p>
                <p class="mt-2 text-sm">Please try logging in again.</p>
            </div>
            <div class="flex justify-center mt-4">
                <a href="/login" class="px-4 py-2 bg-swift-purple text-white rounded-md hover:bg-purple-700 transition-colors">
                    Back to Login
                </a>
            </div>
        {:else}
            <div class="flex justify-center py-4">
                <div class="w-12 h-12 border-4 border-purple-200 border-t-swift-purple rounded-full animate-spin"></div>
            </div>
            <p class="text-center text-gray-600">
                Please wait while we verify your account...
            </p>
        {/if}
    </div>
</div>
