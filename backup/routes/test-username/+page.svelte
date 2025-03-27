<script lang="ts">
  import { onMount } from 'svelte';
  
  let username = $state('');
  let result = $state<any>(null);
  let loading = $state(false);
  let error = $state<string | null>(null);
  
  async function checkUsername() {
    if (!username) {
      error = 'Please enter a username';
      return;
    }
    
    loading = true;
    error = null;
    result = null;
    
    try {
      const response = await fetch('/api/test-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      
      result = await response.json();
      
      if (!response.ok) {
        error = result.error || 'Failed to check username';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to check username';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Test Username Availability</h1>
  
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        id="username"
        type="text"
        bind:value={username}
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-swift-purple"
        placeholder="Enter a username to check"
      />
      <p class="text-sm text-gray-500 mt-1">
        Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens.
      </p>
    </div>
    
    <button
      on:click={checkUsername}
      disabled={loading}
      class="w-full bg-swift-purple text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Checking...' : 'Check Availability'}
    </button>
    
    {#if error}
      <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
      </div>
    {/if}
    
    {#if result && result.success}
      <div class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        <p class="font-medium">✅ Username is available!</p>
        <p class="text-sm mt-1">The username "{result.username}" is available for use.</p>
      </div>
    {/if}
  </div>
  
  <div class="mt-6 flex justify-between">
    <a href="/test-profiles" class="text-swift-purple hover:underline">
      Test Profiles Table
    </a>
    <a href="/" class="text-swift-purple hover:underline">
      Back to Home
    </a>
  </div>
</div>
