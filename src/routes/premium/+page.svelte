<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  let isLoading = true;
  let error = null;
  let isPremium = false;
  let pricing = {
    lifetime: 1313 // $13.13 in cents
  };
  
  onMount(async () => {
    try {
      // Check if user is logged in
      const session = $page.data.session;
      
      if (!session) {
        // Redirect to login if not authenticated
        goto('/login?redirect=/premium');
        return;
      }
      
      // Fetch premium status
      const premiumResponse = await fetch('/api/premium/status');
      
      if (!premiumResponse.ok) {
        const errorData = await premiumResponse.json();
        throw new Error(errorData.message || 'Failed to fetch premium status');
      }
      
      const premiumData = await premiumResponse.json();
      isPremium = premiumData.isPremium;
    } catch (err) {
      console.error('Error loading premium data:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
  
  async function handlePurchase() {
    try {
      isLoading = true;
      
      // Check if user is logged in
      const session = $page.data.session;
      
      if (!session) {
        // Redirect to login if not authenticated
        goto('/login?redirect=/premium');
        return;
      }
      
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isLifetime: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }
      
      const data = await response.json();
      
      // Redirect to checkout
      goto(`/premium/checkout?client_secret=${data.clientSecret}&amount=${pricing.lifetime}`);
    } catch (err) {
      console.error('Error initiating payment:', err);
      error = err.message;
      isLoading = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Premium Access</h1>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-40">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
    </div>
  {:else if isPremium}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <p class="font-bold">You already have premium access!</p>
      <p>Enjoy all the premium features of our app.</p>
    </div>
    
    <button 
      on:click={() => goto('/')}
      class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
    >
      Back to Home
    </button>
  {:else}
    <div class="flex justify-center">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-purple-500 transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
        <div class="bg-purple-600 text-white p-4">
          <h2 class="text-xl font-bold">Lifetime Premium</h2>
          <p class="text-sm opacity-90">One-time payment</p>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <span class="text-3xl font-bold">$13.13</span>
            <span class="text-gray-600">/ lifetime</span>
          </div>
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Lifetime access to all premium features
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Early access to new features
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Access to premium-only Swiftivities
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              No recurring payments
            </li>
          </ul>
          <button 
            on:click={() => handlePurchase()}
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            Get Lifetime Access
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
