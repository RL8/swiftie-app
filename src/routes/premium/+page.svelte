<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  let isLoading = true;
  let error = null;
  let isPremium = false;
  let isEarlyAdopterAvailable = false;
  let earlyAdopterSpots = 0;
  let totalEarlyAdopterSpots = 0;
  let pricing = {
    earlyAdopter: 4900, // $49.00
    quarterly: 1499     // $14.99
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
      
      // Fetch early adopter availability
      const earlyAdopterResponse = await fetch('/api/payments/early-adopter-status');
      
      if (!earlyAdopterResponse.ok) {
        const errorData = await earlyAdopterResponse.json();
        throw new Error(errorData.message || 'Failed to fetch early adopter status');
      }
      
      const earlyAdopterData = await earlyAdopterResponse.json();
      isEarlyAdopterAvailable = earlyAdopterData.isAvailable;
      earlyAdopterSpots = earlyAdopterData.remainingSpots;
      totalEarlyAdopterSpots = earlyAdopterData.totalSpots;
    } catch (err) {
      console.error('Error loading premium data:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
  
  async function handlePurchase(isEarlyAdopter) {
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
          isEarlyAdopter
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }
      
      const data = await response.json();
      
      // Redirect to checkout
      goto(`/premium/checkout?client_secret=${data.clientSecret}&amount=${isEarlyAdopter ? pricing.earlyAdopter : pricing.quarterly}&is_early_adopter=${isEarlyAdopter}`);
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
    <div class="grid md:grid-cols-2 gap-6">
      {#if isEarlyAdopterAvailable}
        <div class="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-purple-500 transform hover:scale-105 transition-transform duration-300">
          <div class="bg-purple-600 text-white p-4">
            <h2 class="text-xl font-bold">Early Adopter</h2>
            <p class="text-sm opacity-90">Limited time offer</p>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <span class="text-3xl font-bold">$49</span>
              <span class="text-gray-600">/ lifetime</span>
            </div>
            <div class="mb-6">
              <div class="h-2 bg-gray-200 rounded-full">
                <div class="h-2 bg-purple-600 rounded-full" style="width: {((totalEarlyAdopterSpots - earlyAdopterSpots) / totalEarlyAdopterSpots) * 100}%"></div>
              </div>
              <p class="text-sm text-gray-600 mt-1">Only {earlyAdopterSpots} spots left!</p>
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
                Priority support
              </li>
              <li class="flex items-center">
                <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                No recurring payments
              </li>
            </ul>
            <button 
              on:click={() => handlePurchase(true)}
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
            >
              Get Lifetime Access
            </button>
          </div>
        </div>
      {/if}
      
      <div class="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div class="bg-gray-800 text-white p-4">
          <h2 class="text-xl font-bold">Quarterly</h2>
          <p class="text-sm opacity-90">Flexible subscription</p>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <span class="text-3xl font-bold">$14.99</span>
            <span class="text-gray-600">/ quarter</span>
          </div>
          <ul class="mb-6 space-y-2">
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Access to all premium features
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Cancel anytime
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Regular updates
            </li>
            <li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Email support
            </li>
          </ul>
          <button 
            on:click={() => handlePurchase(false)}
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            Subscribe Quarterly
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
