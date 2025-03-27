<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Parse error details from URL parameters
  const errorType = $derived($page.url.searchParams.get('type') || 'Unknown Error');
  const errorMessage = $derived($page.url.searchParams.get('message') || 'No error message provided');
  const errorDetails = $derived($page.url.searchParams.get('details') || '');
  const targetRoute = $derived($page.url.searchParams.get('targetRoute') || '/');
  const timestamp = $derived($page.url.searchParams.get('timestamp') || new Date().toISOString());
  
  // Function to try authentication again
  function tryAgain() {
    goto(`/login?redirectTo=${encodeURIComponent(targetRoute)}`);
  }
  
  // Function to go home
  function goHome() {
    goto('/');
  }
  
  // Function to copy error details to clipboard
  function copyErrorDetails() {
    const errorText = `
      Error Type: ${errorType}
      Error Message: ${errorMessage}
      Error Details: ${errorDetails}
      Target Route: ${targetRoute}
      Timestamp: ${timestamp}
    `;
    
    navigator.clipboard.writeText(errorText.trim())
      .then(() => alert('Error details copied to clipboard'))
      .catch(err => console.error('Failed to copy: ', err));
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
  <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-red-600 text-white p-4">
      <h1 class="text-2xl font-bold">Authentication Error</h1>
      <p class="text-sm opacity-80">Development Mode - Detailed Error Information</p>
    </div>
    
    <div class="p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-red-700 mb-2">Error Summary</h2>
        <p class="text-gray-800 font-medium">{errorType}: {errorMessage}</p>
      </div>
      
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Context</h2>
        <div class="bg-gray-100 p-3 rounded">
          <p><span class="font-medium">Attempted Route:</span> {targetRoute}</p>
          <p><span class="font-medium">Timestamp:</span> {timestamp}</p>
        </div>
      </div>
      
      {#if errorDetails}
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">Technical Details</h2>
          <pre class="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">{errorDetails}</pre>
        </div>
      {/if}
      
      <div class="flex flex-wrap gap-3 mt-8">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          on:click={tryAgain}
        >
          Try Again
        </button>
        
        <button 
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          on:click={goHome}
        >
          Go Home
        </button>
        
        <button 
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          on:click={copyErrorDetails}
        >
          Copy Error Details
        </button>
      </div>
      
      <div class="mt-8 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
        <p class="text-sm font-medium">⚠️ Developer Note</p>
        <p class="text-xs">This detailed error page is only available in development mode. In production, users will see a simplified error message.</p>
      </div>
    </div>
  </div>
</div>
