<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Extract error information from the $page store
  const error = $page.error;
  const status = $page.status;
  
  // Check if this is an authentication error (status 302 with redirectURL)
  const isAuthError = status === 302 && error?.redirectURL;
  
  // Function to handle login button click
  function goToLogin() {
    if (isAuthError && error.redirectURL) {
      goto(error.redirectURL);
    } else {
      goto('/login');
    }
  }
  
  // Function to go home
  function goHome() {
    goto('/');
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
  <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
    {#if isAuthError}
      <!-- Authentication Error -->
      <div class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">Authentication Required</h1>
      </div>
      
      <div class="p-6">
        <p class="text-gray-800 mb-6">
          {error.message || "You must be logged in to view this page."}
        </p>
        
        <div class="flex flex-wrap gap-3 mt-8">
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            on:click={goToLogin}
          >
            Go to Login
          </button>
          
          <button 
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            on:click={goHome}
          >
            Return to Home
          </button>
        </div>
      </div>
    {:else}
      <!-- Generic Error -->
      <div class="bg-red-600 text-white p-4">
        <h1 class="text-2xl font-bold">Error {status}</h1>
      </div>
      
      <div class="p-6">
        <p class="text-gray-800 mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        
        <div class="flex flex-wrap gap-3 mt-8">
          <button 
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            on:click={goHome}
          >
            Return to Home
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
