// Simple test script for Stripe integration
import fetch from 'node-fetch';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripeIntegration() {
  try {
    console.log('Testing Stripe integration...');
    
    // Test Stripe API connection
    const balance = await stripe.balance.retrieve();
    console.log('✅ Successfully connected to Stripe API');
    console.log('Available balance:', balance.available[0].amount);
    
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testStripeIntegration();
