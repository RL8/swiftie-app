-- Create premium_users table to track users with premium access
CREATE TABLE IF NOT EXISTS premium_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_type TEXT CHECK (subscription_type IN ('early_adopter', 'quarterly', 'none')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_records table to track all payment transactions
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_status TEXT CHECK (payment_status IN ('succeeded', 'pending', 'failed')),
  payment_type TEXT CHECK (payment_type IN ('one_time', 'subscription')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create early_adopter_count table to track the number of early adopters
CREATE TABLE IF NOT EXISTS early_adopter_count (
  id SERIAL PRIMARY KEY,
  current_count INTEGER DEFAULT 0,
  max_count INTEGER DEFAULT 1989,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row into early_adopter_count
INSERT INTO early_adopter_count (current_count, max_count, updated_at)
VALUES (0, 1989, NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE premium_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE early_adopter_count ENABLE ROW LEVEL SECURITY;

-- Create policies for premium_users
CREATE POLICY "Users can view their own premium status" 
  ON premium_users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Only system can insert premium status" 
  ON premium_users FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Only system can update premium status" 
  ON premium_users FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for payment_records
CREATE POLICY "Users can view their own payment records" 
  ON payment_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert payment records" 
  ON payment_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for early_adopter_count
CREATE POLICY "Everyone can view early adopter count" 
  ON early_adopter_count FOR SELECT 
  USING (true);

CREATE POLICY "Only system can update early adopter count" 
  ON early_adopter_count FOR UPDATE 
  USING (false);

-- Create function to increment early adopter count
CREATE OR REPLACE FUNCTION increment_early_adopter_count()
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  -- Get current values
  SELECT e.current_count, e.max_count INTO current_count, max_count
  FROM early_adopter_count e
  WHERE id = 1;
  
  -- Check if we've reached the maximum
  IF current_count >= max_count THEN
    RETURN -1; -- Indicates we've reached the maximum
  END IF;
  
  -- Increment the count
  UPDATE early_adopter_count
  SET current_count = current_count + 1,
      updated_at = NOW()
  WHERE id = 1;
  
  -- Return the new count
  RETURN current_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if early adopter slots are available
CREATE OR REPLACE FUNCTION check_early_adopter_availability()
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_count INTEGER;
BEGIN
  -- Get current values
  SELECT e.current_count, e.max_count INTO current_count, max_count
  FROM early_adopter_count e
  WHERE id = 1;
  
  -- Check if slots are available
  RETURN current_count < max_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
