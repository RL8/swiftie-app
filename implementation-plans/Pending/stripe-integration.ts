// File: src/lib/server/stripe.ts
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Make sure to use the latest API version
  maxNetworkRetries: 3, // Important for high volume processing
});

// File: src/lib/server/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/static/private';

// Use service key for admin access in server endpoints
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// File: src/routes/api/checkout/+server.ts
import { json, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { supabaseAdmin } from '$lib/server/supabase';
import { BASE_URL } from '$env/static/private';

export async function POST({ request, locals }) {
  try {
    // Get authenticated user from session
    const session = await locals.getSession();
    if (!session) {
      throw error(401, 'Unauthorized');
    }
    
    const userId = session.user.id;
    const email = session.user.email;
    
    // Get request data
    const { priceId, isSubscription = false, couponId = null } = await request.json();
    
    // Generate idempotency key based on user and price to prevent duplicate charges
    const idempotencyKey = `${userId}-${priceId}-${Date.now()}`;
    
    // Find or create Stripe customer
    const { data: customers } = await supabaseAdmin
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle();
      
    let customerId;
    
    if (customers?.stripe_customer_id) {
      customerId = customers.stripe_customer_id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create(
        { email, metadata: { userId } },
        { idempotencyKey: `customer-${idempotencyKey}` }
      );
      
      customerId = customer.id;
      
      // Store customer ID in Supabase
      await supabaseAdmin
        .from('stripe_customers')
        .insert({ user_id: userId, stripe_customer_id: customerId });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: isSubscription ? 'subscription' : 'payment',
        success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/cancel`,
        // Apply coupon if provided
        ...(couponId && { discounts: [{ coupon: couponId }] }),
        // Add metadata for tracking
        metadata: {
          userId,
          idempotencyKey,
        },
      },
      { idempotencyKey }
    );
    
    // Store checkout session in Supabase
    await supabaseAdmin
      .from('stripe_sessions')
      .insert({
        user_id: userId,
        session_id: session.id,
        status: 'created',
        mode: isSubscription ? 'subscription' : 'payment',
        metadata: session.metadata,
      });
    
    return json({ id: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    return error(500, 'Failed to create checkout session');
  }
}

// File: src/routes/api/stripe/webhooks/+server.ts
import { stripe } from '$lib/server/stripe';
import { supabaseAdmin } from '$lib/server/supabase';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

// This endpoint needs to be exempted from CSRF protection
export const config = {
  csrf: false
};

export async function POST({ request }) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  // Log all events to Supabase for maximum tracking
  try {
    await supabaseAdmin
      .from('stripe_events')
      .insert({
        event_id: event.id,
        event_type: event.type,
        event_data: event.data,
        created_at: new Date(event.created * 1000).toISOString(),
      });
  } catch (err) {
    console.error('Failed to log Stripe event:', err);
  }
  
  // Handle specific events
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId } = session.metadata;
        
        // Update session status
        await supabaseAdmin
          .from('stripe_sessions')
          .update({ status: 'completed' })
          .eq('session_id', session.id);
          
        if (session.mode === 'subscription') {
          // Store subscription info in Supabase
          await supabaseAdmin
            .from('stripe_subscriptions')
            .insert({
              user_id: userId,
              subscription_id: session.subscription,
              status: 'active',
              customer_id: session.customer,
              price_id: session.line_items?.data[0]?.price?.id,
              current_period_end: null, // Will be updated by subscription.updated event
            });
            
          // Update user's subscription status
          await supabaseAdmin
            .from('users')
            .update({ is_subscribed: true })
            .eq('id', userId);
        }
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId; // Make sure to add this when creating subscriptions
        
        if (userId) {
          await supabaseAdmin
            .from('stripe_subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('subscription_id', subscription.id);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          await supabaseAdmin
            .from('stripe_subscriptions')
            .update({ status: 'canceled' })
            .eq('subscription_id', subscription.id);
            
          // Check if user has any other active subscriptions
          const { data: activeSubscriptions } = await supabaseAdmin
            .from('stripe_subscriptions')
            .select('subscription_id')
            .eq('user_id', userId)
            .eq('status', 'active');
            
          if (!activeSubscriptions?.length) {
            // Update user's subscription status
            await supabaseAdmin
              .from('users')
              .update({ is_subscribed: false })
              .eq('id', userId);
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
      case 'charge.succeeded':
      case 'charge.failed': 
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
        // Process these events as needed
        // Log them to your database for audit/support purposes
        break;
    }
  } catch (err) {
    console.error(`Error handling webhook event ${event.type}:`, err);
    // Don't return an error to Stripe - we want to acknowledge receipt
  }
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// File: src/routes/subscription/+page.svelte
<script lang="ts">
  import { PUBLIC_STRIPE_KEY } from '$env/static/public';
  import { loadStripe } from '@stripe/stripe-js';
  import { page } from '$app/stores';
  
  // Get pricing data from +page.server.ts
  export let data;
  
  // Check if user is eligible for early bird pricing
  $: isEarlyBird = data.user?.isEarlyBirdEligible || false;
  
  async function handleCheckout(priceId: string, isSubscription = true) {
    try {
      const stripe = await loadStripe(PUBLIC_STRIPE_KEY);
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          priceId, 
          isSubscription,
          // Apply coupon if early bird eligible
          ...(isEarlyBird && { couponId: 'early-bird-discount' })
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const { id } = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: id });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to process checkout. Please try again.');
    }
  }
</script>

<div class="subscription-container">
  <h1>Choose Your Plan</h1>
  
  {#if isEarlyBird}
    <div class="discount-badge">
      Early Bird Discount Available!
    </div>
  {/if}
  
  <div class="plan-card">
    <h2>Annual Subscription</h2>
    <p class="price">${data.annualPlan.unitAmount / 100}/year</p>
    <ul>
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
    <button 
      on:click={() => handleCheckout(data.annualPlan.id, true)}
      class="subscribe-button"
    >
      Subscribe Now
    </button>
  </div>
</div>

<style>
  .subscription-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .discount-badge {
    background: #ffdd57;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    margin-bottom: 1rem;
    display: inline-block;
  }
  
  .plan-card {
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 1rem;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .subscribe-button {
    background: #4a56e2;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .subscribe-button:hover {
    background: #3a46d2;
  }
</style>

// File: src/routes/subscription/+page.server.ts
import { stripe } from '$lib/server/stripe';
import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function load({ locals }) {
  // Get authenticated user
  const session = await locals.getSession();
  if (!session) {
    throw redirect(303, '/login');
  }
  
  const userId = session.user.id;
  
  try {
    // Get user data including early bird eligibility
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('is_early_bird_eligible')
      .eq('id', userId)
      .single();
      
    // Get plan pricing
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });
    
    const annualPlan = products.data
      .find(product => product.name === 'Annual Subscription')
      ?.default_price;
      
    if (!annualPlan) {
      throw new Error('Annual plan not found in Stripe');
    }
    
    return {
      user: {
        isEarlyBirdEligible: userData?.is_early_bird_eligible || false
      },
      annualPlan: {
        id: annualPlan.id,
        unitAmount: annualPlan.unit_amount,
        currency: annualPlan.currency
      }
    };
  } catch (err) {
    console.error('Error loading subscription data:', err);
    return {
      error: 'Failed to load subscription data'
    };
  }
}

// Database Tables (for Supabase)
/*
CREATE TABLE stripe_customers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stripe_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL,
  mode TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stripe_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  subscription_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stripe_events (
  id SERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add this to your existing users table
ALTER TABLE users ADD COLUMN is_subscribed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_early_bird_eligible BOOLEAN DEFAULT FALSE;
*/
