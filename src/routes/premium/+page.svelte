<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  let isPremium = false;
  let isLoading = true;
  let error = null;
  let pricing = {
    amount: 0,
    isEarlyAdopter: false,
    isOneTime: false
  };
  
  onMount(async () => {
    try {
      // Check if user is already premium
      const statusRes = await fetch('/api/premium/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        isPremium = statusData.isPremium;
      }
      
      // Get pricing information
      const pricingRes = await fetch('/api/payments/create-intent', {
        method: 'GET'
      });
      
      if (pricingRes.ok) {
        const pricingData = await pricingRes.json();
        pricing = pricingData;
      } else {
        const errorData = await pricingRes.json();
        error = errorData.error || 'Failed to get pricing information';
      }
    } catch (err) {
      console.error('Error checking premium status:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
  
  async function handlePayment() {
    try {
      isLoading = true;
      
      // Create payment intent
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      
      const data = await res.json();
      
      // Redirect to checkout page with client secret
      goto(`/premium/checkout?client_secret=${data.clientSecret}&amount=${data.amount}&is_early_adopter=${data.isEarlyAdopter}`);
    } catch (err) {
      console.error('Error creating payment intent:', err);
      error = err.message;
    } finally {
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
      <p>You already have premium access! Enjoy all the features.</p>
    </div>
  {:else}
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">Unlock Premium Features</h2>
      
      <div class="mb-6">
        <div class="text-4xl font-bold text-purple-600 mb-2">
          ${(pricing.amount / 100).toFixed(2)}
        </div>
        
        {#if pricing.isEarlyAdopter}
          <div class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm inline-block mb-2">
            Early Adopter Special
          </div>
          <p class="text-gray-600">
            You're one of the first 1989 users! Get lifetime access for a one-time payment.
          </p>
        {:else}
          <p class="text-gray-600">
            Quarterly subscription for premium access.
          </p>
        {/if}
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">What you get:</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Exclusive Taylor Swift content</li>
          <li>Ad-free experience</li>
          <li>Early access to new features</li>
          <li>Premium support</li>
        </ul>
      </div>
      
      <button 
        on:click={handlePayment}
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Get Premium Access'}
      </button>
    </div>
  {/if}
</div>
