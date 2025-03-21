import { json } from '@sveltejs/kit';
import { createPaymentIntent, getCurrentPrice } from '$lib/services/stripe';
import { checkEarlyAdopterAvailability } from '$lib/services/database';
import { supabase } from '$lib/supabase/client';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * POST handler for creating a payment intent
 */
export async function POST(event: RequestEvent) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current price based on early adopter availability
    const pricing = await getCurrentPrice(supabase);
    
    // Create a payment intent
    const paymentIntent = await createPaymentIntent(
      pricing.amount,
      'usd',
      {
        userId: user.id,
        paymentType: pricing.type
      }
    );

    // Return the client secret and pricing information
    return json({
      clientSecret: paymentIntent.client_secret,
      amount: pricing.amount,
      currency: 'usd',
      id: paymentIntent.id,
      isEarlyAdopter: pricing.type === 'early_adopter',
      isOneTime: pricing.isOneTime
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}

/**
 * GET handler for checking pricing
 */
export async function GET() {
  try {
    // Get the current price based on early adopter availability
    const pricing = await getCurrentPrice(supabase);
    
    // Return the pricing information
    return json({
      amount: pricing.amount,
      currency: 'usd',
      isEarlyAdopter: pricing.type === 'early_adopter',
      isOneTime: pricing.isOneTime
    });
  } catch (error) {
    console.error('Error getting pricing information:', error);
    return json({ error: 'Failed to get pricing information' }, { status: 500 });
  }
}
