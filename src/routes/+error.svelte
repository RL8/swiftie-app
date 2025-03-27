<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Extract error information from the $page store
  const error = $page.error;
  const status = $page.status;
  
  // Function to go home
  function goHome() {
    goto('/');
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
  <div class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- General Error -->
    <div class="bg-rose-600 text-white p-4">
      <h1 class="text-2xl font-bold">Error {status}</h1>
    </div>
    
    <div class="p-6">
      <p class="text-gray-800 mb-6">
        {error?.message || "Something went wrong. Please try again."}
      </p>
      
      <div class="flex flex-wrap gap-3 mt-8">
        <button 
          class="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
          on:click={goHome}
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</div>
