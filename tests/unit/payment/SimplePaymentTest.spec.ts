import { describe, it, expect } from 'vitest';

describe('Payment System', () => {
  it('should verify Stripe integration exists', () => {
    // Check that the Stripe service file exists and exports expected functions
    const stripeService = require('../../../src/lib/services/stripe');
    
    // Verify key functions exist
    expect(stripeService.createPaymentIntent).toBeDefined();
    expect(stripeService.getCurrentPrice).toBeDefined();
    expect(stripeService.checkEarlyAdopterAvailability).toBeDefined();
    expect(stripeService.verifyWebhookSignature).toBeDefined();
    
    // Verify the webhook handler exists
    const webhookHandler = require('../../../src/routes/api/webhooks/stripe/+server');
    expect(webhookHandler.POST).toBeDefined();
  });
  
  it('should verify database tables for payment processing exist', () => {
    // This is a simple check that our SQL migration file contains the expected tables
    const fs = require('fs');
    const path = require('path');
    
    const sqlPath = path.join(process.cwd(), 'supabase/migrations/20250321000000_add_stripe_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Check for key tables
    expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS premium_users');
    expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS payment_records');
    expect(sqlContent).toContain('CREATE TABLE IF NOT EXISTS early_adopter_count');
    
    // Check for key functions
    expect(sqlContent).toContain('CREATE OR REPLACE FUNCTION increment_early_adopter_count()');
    expect(sqlContent).toContain('CREATE OR REPLACE FUNCTION check_early_adopter_availability()');
  });
});
