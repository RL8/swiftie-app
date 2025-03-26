import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

// Initialize Stripe with the secret key
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for a one-time payment
 * @param amount Amount in cents
 * @param currency Currency code (default: 'usd')
 * @param metadata Additional metadata for the payment
 * @returns Payment intent object
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Check if early adopter slots are available
 * @param supabaseClient Supabase client instance
 * @returns Boolean indicating if early adopter slots are available
 */
export async function checkEarlyAdopterAvailability(supabaseClient: any) {
  try {
    const { data, error } = await supabaseClient.rpc('check_early_adopter_availability');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking early adopter availability:', error);
    throw error;
  }
}

/**
 * Get the current price based on early adopter availability
 * @param supabaseClient Supabase client instance
 * @returns Object with price and payment type
 */
export async function getCurrentPrice(supabaseClient: any) {
  try {
    // Simplified to single lifetime price of $13.13
    return {
      amount: 1313, // $13.13 in cents
      type: 'lifetime',
      isOneTime: true
    };
  } catch (error) {
    console.error('Error getting current price:', error);
    throw error;
  }
}

/**
 * Verify a Stripe webhook signature
 * @param payload Request body as string
 * @param signature Stripe signature from headers
 * @returns Event object if valid, throws error if invalid
 */
export function verifyWebhookSignature(payload: string, signature: string) {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * Get Stripe publishable key
 * @returns Stripe publishable key
 */
export function getPublishableKey() {
  return PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

export default {
  createPaymentIntent,
  checkEarlyAdopterAvailability,
  getCurrentPrice,
  verifyWebhookSignature,
  getPublishableKey
};
