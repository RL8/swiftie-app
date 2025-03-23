<script>
  import { goto } from '$app/navigation';
  
  function goToLogin() {
    goto('/login');
  }
  
  function goHome() {
    goto('/');
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
  <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-red-600 text-white p-4">
      <h1 class="text-2xl font-bold">Authentication Error</h1>
    </div>
    
    <div class="p-6">
      <p class="text-gray-800 mb-6">
        There was a problem with your authentication. This could be due to an expired session or missing permissions.
      </p>
      
      <div class="flex flex-wrap gap-3 mt-8">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          on:click={goToLogin}
        >
          Sign In
        </button>
        
        <button 
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          on:click={goHome}
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</div>
