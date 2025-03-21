<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  let isLoading = true;
  let error = null;
  let paymentStatus = null;
  
  onMount(async () => {
    try {
      if (browser) {
        // Get query parameters
        const params = new URLSearchParams(window.location.search);
        const paymentIntent = params.get('payment_intent');
        const paymentIntentClientSecret = params.get('payment_intent_client_secret');
        
        if (!paymentIntent || !paymentIntentClientSecret) {
          throw new Error('Missing payment information');
        }
        
        // Load Stripe
        const stripeJs = await import('@stripe/stripe-js');
        const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
        
        if (!stripePublishableKey) {
          throw new Error('Stripe publishable key is not configured');
        }
        
        const stripe = await stripeJs.loadStripe(stripePublishableKey);
        
        // Retrieve payment status
        const { paymentIntent: retrievedPaymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
        
        paymentStatus = retrievedPaymentIntent.status;
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8">
    {#if isLoading}
      <div class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    {:else if error}
      <div class="text-center">
        <div class="text-red-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-4">Payment Error</h1>
        <p class="text-gray-600 mb-6">{error}</p>
        <button 
          on:click={() => goto('/premium')}
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
        >
          Try Again
        </button>
      </div>
    {:else if paymentStatus === 'succeeded'}
      <div class="text-center">
        <div class="text-green-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p class="text-gray-600 mb-6">Thank you for your purchase. Your premium access is now active.</p>
        <button 
          on:click={() => goto('/')}
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
        >
          Go to Home
        </button>
      </div>
    {:else}
      <div class="text-center">
        <div class="text-yellow-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-4">Payment Processing</h1>
        <p class="text-gray-600 mb-6">Your payment is being processed. We'll update your account status shortly.</p>
        <button 
          on:click={() => goto('/')}
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150"
        >
          Go to Home
        </button>
      </div>
    {/if}
  </div>
</div>
