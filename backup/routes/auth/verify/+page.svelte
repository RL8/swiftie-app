<script>
  import { enhance } from '$app/forms';
  
  // Get data from server
  const data = $props();
  
  // Form state
  let isResending = false;
  let isUpdating = false;
  let showEditEmail = false;
  let newEmail = data.email || '';
  let resendSuccess = false;
  let resendMessage = '';
  let updateSuccess = false;
  let updateMessage = '';
  let resendTimer = 0;
  
  // Function to handle resend cooldown
  function startResendTimer() {
    resendTimer = 60;
    const interval = setInterval(() => {
      resendTimer--;
      if (resendTimer <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
  
  // Handle form submission results
  function handleResendResult(result) {
    isResending = false;
    
    if (result.type === 'success') {
      resendSuccess = true;
      resendMessage = result.data.message;
      startResendTimer();
    } else {
      resendSuccess = false;
      resendMessage = result.data?.message || 'Failed to send verification email';
    }
  }
  
  function handleUpdateResult(result) {
    isUpdating = false;
    
    if (result.type === 'success') {
      updateSuccess = true;
      updateMessage = result.data.message;
      newEmail = result.data.newEmail;
      showEditEmail = false;
    } else {
      updateSuccess = false;
      updateMessage = result.data?.message || 'Failed to update email';
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
    <h1 class="text-2xl font-bold text-center text-gray-800">Verify Your Email</h1>
    
    <div class="text-center">
      <div class="mb-6 p-4 bg-purple-50 rounded-lg">
        <p class="text-gray-700">We've sent a verification link to:</p>
        {#if !showEditEmail}
          <p class="font-medium text-lg text-purple-700 mt-2">{newEmail}</p>
          <button 
            on:click={() => showEditEmail = true}
            class="mt-2 text-sm text-purple-600 hover:text-purple-800 underline"
          >
            Change email address
          </button>
        {:else}
          <form 
            method="POST" 
            action="?/updateEmail" 
            class="mt-3"
            use:enhance={() => {
              isUpdating = true;
              return async ({ result }) => {
                handleUpdateResult(result);
              };
            }}
          >
            <div class="flex flex-col space-y-2">
              <input 
                type="email" 
                name="email" 
                bind:value={newEmail}
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new email address"
                required
              />
              <div class="flex space-x-2">
                <button 
                  type="submit" 
                  class="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                  disabled={isUpdating}
                >
                  {#if isUpdating}
                    <div class="flex justify-center items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  {:else}
                    Update Email
                  {/if}
                </button>
                <button 
                  type="button" 
                  on:click={() => showEditEmail = false}
                  class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        {/if}
      </div>
      
      {#if updateMessage}
        <div class={`p-3 mb-4 rounded-md ${updateSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {updateMessage}
        </div>
      {/if}
      
      <p class="text-gray-600 mb-4">
        Please check your inbox and click the verification link to activate your account.
      </p>
      
      <div class="space-y-4">
        <p class="text-gray-600">
          Didn't receive the email? Check your spam folder or request a new verification link.
        </p>
        
        {#if resendMessage}
          <div class={`p-3 mb-4 rounded-md ${resendSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {resendMessage}
          </div>
        {/if}
        
        <form 
          method="POST" 
          action="?/resendVerification" 
          use:enhance={() => {
            isResending = true;
            return async ({ result }) => {
              handleResendResult(result);
            };
          }}
        >
          <button 
            type="submit" 
            class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isResending || resendTimer > 0}
          >
            {#if isResending}
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            {:else if resendTimer > 0}
              Resend in {resendTimer}s
            {:else}
              Resend Verification Email
            {/if}
          </button>
        </form>
        
        <div class="border-t pt-4 mt-4">
          <a 
            href="/login" 
            class="text-purple-600 hover:text-purple-800 underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
