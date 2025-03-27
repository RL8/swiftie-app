<script lang="ts">
  import { onMount } from 'svelte';
  
  let result = $state<any>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  
  onMount(async () => {
    try {
      const response = await fetch('/api/test-profiles');
      result = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to test profiles table';
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Testing Profiles Table</h1>
  
  {#if loading}
    <div class="flex justify-center py-4">
      <div class="w-12 h-12 border-4 border-purple-200 border-t-swift-purple rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-bold">Error</p>
      <p>{error}</p>
    </div>
  {:else}
    <div class="bg-gray-100 p-4 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">
        {result.success ? '✅ Success' : '❌ Failed'}
      </h2>
      
      {#if result.success}
        <p class="text-green-700">{result.message}</p>
        <div class="mt-4">
          <h3 class="font-medium">Sample Data:</h3>
          <pre class="bg-gray-800 text-white p-4 rounded mt-2 overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      {:else}
        <p class="text-red-700">{result.error}</p>
      {/if}
      
      <div class="mt-6">
        <a href="/" class="px-4 py-2 bg-swift-purple text-white rounded-md hover:bg-purple-700 transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  {/if}
</div>
