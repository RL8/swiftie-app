import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { verifyWebhookSignature } from '$lib/services/stripe';
import { 
  updateUserPremiumStatus, 
  recordPayment, 
  incrementEarlyAdopterCount,
  checkEarlyAdopterAvailability
} from '$lib/services/database';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * POST handler for Stripe webhooks
 */
export async function POST(event: RequestEvent) {
  try {
    // Get the raw body and signature from the request
    const body = await event.request.text();
    const signature = event.request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    // Verify the webhook signature
    const stripeEvent = verifyWebhookSignature(body, signature);

    // Process the event based on its type
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(stripeEvent.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handleFailedPayment(stripeEvent.data.object);
        break;
      
      // Add more event handlers as needed
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return json({ error: 'Webhook error' }, { status: 400 });
  }
}

/**
 * Handle a successful payment
 */
async function handleSuccessfulPayment(paymentIntent: any) {
  try {
    // Extract customer information from metadata
    const { userId, paymentType } = paymentIntent.metadata;
    
    if (!userId) {
      console.error('Missing user ID in payment metadata');
      return;
    }

    // Record the payment in the database
    await recordPayment(
      paymentIntent.id,
      paymentIntent.amount,
      paymentIntent.currency,
      'succeeded',
      paymentType || 'one_time'
    );

    // Determine subscription type and dates
    let subscriptionType: 'early_adopter' | 'quarterly' | 'none' = 'none';
    let startDate = new Date();
    let endDate: Date | undefined;

    if (paymentType === 'early_adopter') {
      // Check if early adopter slots are still available
      const isAvailable = await checkEarlyAdopterAvailability();
      
      if (isAvailable) {
        // Increment the early adopter count
        const newCount = await incrementEarlyAdopterCount();
        
        if (newCount > 0) {
          subscriptionType = 'early_adopter';
          // Early adopters get lifetime access, so no end date
        } else {
          // If increment failed, fall back to quarterly
          subscriptionType = 'quarterly';
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 3);
        }
      } else {
        // If no slots available, fall back to quarterly
        subscriptionType = 'quarterly';
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);
      }
    } else if (paymentType === 'quarterly') {
      subscriptionType = 'quarterly';
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
    }

    // Update the user's premium status
    await updateUserPremiumStatus(
      true,
      subscriptionType,
      startDate,
      endDate
    );

    console.log(`Successfully processed payment for user ${userId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

/**
 * Handle a failed payment
 */
async function handleFailedPayment(paymentIntent: any) {
  try {
    // Extract customer information from metadata
    const { userId, paymentType } = paymentIntent.metadata;
    
    if (!userId) {
      console.error('Missing user ID in payment metadata');
      return;
    }

    // Record the failed payment
    await recordPayment(
      paymentIntent.id,
      paymentIntent.amount,
      paymentIntent.currency,
      'failed',
      paymentType || 'one_time'
    );

    console.log(`Recorded failed payment for user ${userId}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}
