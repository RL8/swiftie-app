<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { loadStripe } from '@stripe/stripe-js';
  
  let stripe;
  let elements;
  let cardElement;
  let isLoading = true;
  let isProcessing = false;
  let error = null;
  let success = false;
  
  // Get query parameters
  let clientSecret = '';
  let amount = 0;
  
  onMount(async () => {
    try {
      if (browser) {
        // Get query parameters
        const params = new URLSearchParams(window.location.search);
        clientSecret = params.get('client_secret');
        amount = parseFloat(params.get('amount') || '0');
        
        if (!clientSecret) {
          throw new Error('Missing payment information');
        }
        
        // Load Stripe
        const stripePublishableKey = import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
        
        if (!stripePublishableKey) {
          throw new Error('Stripe publishable key is not configured');
        }
        
        stripe = await loadStripe(stripePublishableKey);
        
        // Create Elements instance
        elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#9333ea',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              spacingUnit: '4px',
              borderRadius: '4px'
            }
          }
        });
        
        // Create and mount the Payment Element
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
      }
    } catch (err) {
      console.error('Error setting up payment:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    isProcessing = true;
    
    try {
      // Confirm the payment
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/premium/success`
        }
      });
      
      if (submitError) {
        throw new Error(submitError.message);
      }
    } catch (err) {
      console.error('Payment error:', err);
      error = err.message;
      isProcessing = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Complete Your Purchase</h1>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-40">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
      <button 
        on:click={() => goto('/premium')}
        class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
      >
        Go Back
      </button>
    </div>
  {:else}
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
        
        <div class="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <p class="font-medium">Premium Access</p>
            <p class="text-sm text-gray-600">
              Lifetime access
            </p>
          </div>
          <div class="text-xl font-bold">${(amount / 100).toFixed(2)}</div>
        </div>
        
        <div class="flex justify-between items-center font-bold">
          <p>Total</p>
          <p>${(amount / 100).toFixed(2)}</p>
        </div>
      </div>
      
      <form on:submit={handleSubmit}>
        <div class="mb-6">
          <div id="payment-element" class="mb-4"></div>
        </div>
        
        <button 
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          disabled={isProcessing || !stripe}
        >
          {#if isProcessing}
            <div class="flex justify-center items-center">
              <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          {:else}
            Pay ${(amount / 100).toFixed(2)}
          {/if}
        </button>
      </form>
    </div>
  {/if}
</div>
