/**
 * Represents a user's premium status
 */
export interface PremiumUser {
  id: string;
  is_premium: boolean;
  subscription_type: 'lifetime' | 'none';
  subscription_start_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a payment record
 */
export interface PaymentRecord {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  payment_status: 'succeeded' | 'pending' | 'failed';
  payment_type: 'one_time' | 'subscription';
  created_at: string;
}

/**
 * Represents the early adopter count
 */
export interface EarlyAdopterCount {
  id: number;
  current_count: number;
  max_count: number;
  updated_at: string;
}

/**
 * Represents the pricing information
 */
export interface PricingInfo {
  amount: number;
  type: 'early_adopter' | 'quarterly';
  isOneTime: boolean;
}

/**
 * Represents a Stripe payment intent
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  id: string;
}
