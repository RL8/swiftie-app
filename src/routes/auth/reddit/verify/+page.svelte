<script lang="ts">
  import { goto } from '$app/navigation';
  
  const data = $props();
  
  let redirecting = $state(false);
  
  function continueToApp() {
    redirecting = true;
    setTimeout(() => {
      goto('/feed');
    }, 1000);
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
    <div class="mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-16 h-16 mx-auto fill-reddit-orange">
        <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm5.7 11.1c.1.1.1.2.1.4 0 .3-.2.5-.5.5-.1 0-.3-.1-.4-.2-1 .7-2.3 1-3.7 1-1.3 0-2.6-.3-3.7-1-.1.1-.2.2-.4.2-.3 0-.5-.2-.5-.5 0-.1 0-.3.1-.4-.6-.5-1-1.2-1-2 0-1.4 1.1-2.5 2.5-2.5.3 0 .6.1.9.2 1-.5 2.2-.8 3.4-.8.1 0 .1 0 .2-.1.1-.3.4-.5.7-.5.4 0 .7.3.7.7 0 .3-.2.6-.5.7v.2c1.2 0 2.3.3 3.4.8.3-.1.6-.2.9-.2 1.4 0 2.5 1.1 2.5 2.5 0 .8-.4 1.5-1 2zm-8.3-1.5c0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2zm5.8 2.5c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2z"/>
      </svg>
    </div>
    
    {#if data.success}
      {#if data.isVerified}
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">Swiftie Verified!</h1>
        <p class="text-lg text-gray-700 mb-4">
          We were able to verify your Swiftiness based on your Reddit history!
        </p>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-6 text-left">
          <h3 class="font-medium text-gray-800 mb-2">Your Swiftie Activity:</h3>
          <p class="text-sm text-gray-700">
            <span class="font-medium">{data.activityDetails.commentCount}</span> comments and 
            <span class="font-medium">{data.activityDetails.postCount}</span> posts in Taylor Swift subreddits
          </p>
        </div>
      {:else}
        <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">Not Quite a Swiftie Yet</h1>
        <p class="text-lg text-gray-700 mb-4">
          We couldn't verify your Swiftiness based on your Reddit history.
        </p>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-6 text-left">
          <h3 class="font-medium text-gray-800 mb-2">Your Activity:</h3>
          <p class="text-sm text-gray-700 mb-2">
            <span class="font-medium">{data.activityDetails.commentCount}</span> comments and 
            <span class="font-medium">{data.activityDetails.postCount}</span> posts in Taylor Swift subreddits
          </p>
          <p class="text-sm text-gray-700">
            To qualify, you need at least 3 comments OR 1 post in Taylor Swift subreddits.
          </p>
        </div>
      {/if}
      
      {#if redirecting}
        <div class="mb-4">
          <div class="w-12 h-12 border-t-4 border-b-4 border-swift-purple rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-gray-600">Redirecting to app...</p>
        </div>
      {:else}
        <button 
          onclick={continueToApp}
          class="w-full py-2 px-4 bg-swift-purple hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
        >
          Continue as a {data.isVerified ? 'Verified' : 'Non-Verified'} Swiftie
        </button>
      {/if}
    {:else}
      <h1 class="text-2xl font-semibold text-gray-800 mb-2">Verification Error</h1>
      <p class="text-gray-600 mb-6">
        {data.error || "We couldn't verify your Reddit activity. Please try again."}
      </p>
      
      <a 
        href="/auth/reddit" 
        class="inline-block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
      >
        Try Again
      </a>
    {/if}
  </div>
</div>

<style>
  /* Reddit brand colors */
  :global(.bg-reddit-orange) {
    background-color: #FF4500;
  }
  
  :global(.fill-reddit-orange) {
    fill: #FF4500;
  }
  
  /* Swift brand colors */
  :global(.bg-swift-purple) {
    background-color: #8A2BE2;
  }
  
  :global(.border-swift-purple) {
    border-color: #8A2BE2;
  }
</style>
