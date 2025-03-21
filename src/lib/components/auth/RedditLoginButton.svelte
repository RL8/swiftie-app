<script lang="ts">
  import { createUserProfileContext } from '$lib/context/user.svelte';
  
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let fullWidth = false;
  
  const userContext = createUserProfileContext();
  
  function handleRedditLogin() {
    userContext.initiateRedditAuth();
  }
  
  // Determine button classes based on size prop
  const buttonClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
</script>

<button
  on:click={handleRedditLogin}
  class="flex items-center justify-center gap-2 bg-reddit-orange hover:bg-reddit-orange-dark text-white font-medium rounded-md transition-colors {buttonClasses[size]} {widthClass}"
>
  <!-- Reddit Logo -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-5 h-5 fill-current">
    <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm5.7 11.1c.1.1.1.2.1.4 0 .3-.2.5-.5.5-.1 0-.3-.1-.4-.2-1 .7-2.3 1-3.7 1-1.3 0-2.6-.3-3.7-1-.1.1-.2.2-.4.2-.3 0-.5-.2-.5-.5 0-.1 0-.3.1-.4-.6-.5-1-1.2-1-2 0-1.4 1.1-2.5 2.5-2.5.3 0 .6.1.9.2 1-.5 2.2-.8 3.4-.8.1 0 .1 0 .2-.1.1-.3.4-.5.7-.5.4 0 .7.3.7.7 0 .3-.2.6-.5.7v.2c1.2 0 2.3.3 3.4.8.3-.1.6-.2.9-.2 1.4 0 2.5 1.1 2.5 2.5 0 .8-.4 1.5-1 2zm-8.3-1.5c0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2zm5.8 2.5c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2z"/>
  </svg>
  Sign in with Reddit
</button>

<style>
  /* Reddit brand colors */
  :global(.bg-reddit-orange) {
    background-color: #FF4500;
  }
  
  :global(.bg-reddit-orange-dark) {
    background-color: #E03D00;
  }
</style>
