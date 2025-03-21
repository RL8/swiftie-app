<script lang="ts">
  import { goto } from '$app/navigation';
  import { initiateRedditAuth } from '$lib/reddit';
  import { onMount } from 'svelte';
  
  let redirecting = $state(false);
  
  onMount(() => {
    // Start Reddit authentication automatically after a short delay
    setTimeout(() => {
      redirecting = true;
      setTimeout(() => {
        initiateRedditAuth();
      }, 1000);
    }, 500);
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
    <div class="mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-16 h-16 mx-auto fill-reddit-orange">
        <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm5.7 11.1c.1.1.1.2.1.4 0 .3-.2.5-.5.5-.1 0-.3-.1-.4-.2-1 .7-2.3 1-3.7 1-1.3 0-2.6-.3-3.7-1-.1.1-.2.2-.4.2-.3 0-.5-.2-.5-.5 0-.1 0-.3.1-.4-.6-.5-1-1.2-1-2 0-1.4 1.1-2.5 2.5-2.5.3 0 .6.1.9.2 1-.5 2.2-.8 3.4-.8.1 0 .1 0 .2-.1.1-.3.4-.5.7-.5.4 0 .7.3.7.7 0 .3-.2.6-.5.7v.2c1.2 0 2.3.3 3.4.8.3-.1.6-.2.9-.2 1.4 0 2.5 1.1 2.5 2.5 0 .8-.4 1.5-1 2zm-8.3-1.5c0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2zm5.8 2.5c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2z"/>
      </svg>
    </div>
    
    <h1 class="text-2xl font-semibold text-gray-800 mb-2">Reddit Authentication</h1>
    
    {#if redirecting}
      <div class="mb-4">
        <div class="w-12 h-12 border-t-4 border-b-4 border-reddit-orange rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-gray-600">Redirecting to Reddit for authentication...</p>
      </div>
    {:else}
      <p class="text-gray-600 mb-6">
        You'll be redirected to Reddit to verify your Swiftie status.
      </p>
      
      <button 
        onclick={() => initiateRedditAuth()}
        class="w-full py-2 px-4 bg-reddit-orange hover:bg-reddit-orange-dark text-white font-medium rounded-md transition-colors"
      >
        Continue to Reddit
      </button>
    {/if}
    
    <div class="mt-6 text-sm text-gray-500">
      <p>We'll verify your activity in Taylor Swift subreddits.</p>
      <p class="mt-1">This helps us ensure our community is made up of real Swifties!</p>
    </div>
  </div>
</div>

<style>
  /* Reddit brand colors */
  :global(.bg-reddit-orange) {
    background-color: #FF4500;
  }
  
  :global(.bg-reddit-orange-dark) {
    background-color: #E03D00;
  }
  
  :global(.fill-reddit-orange) {
    fill: #FF4500;
  }
  
  :global(.border-reddit-orange) {
    border-color: #FF4500;
  }
</style>
