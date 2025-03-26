-- Migration script to update premium_users table for simplified premium structure
-- Convert existing subscription types to the new format

-- Step 1: Ensure is_premium field exists (it should already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'premium_users' 
        AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE premium_users ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Step 2: Update existing subscription types to 'lifetime'
UPDATE premium_users
SET 
    subscription_type = 'lifetime',
    subscription_end_date = NULL
WHERE 
    is_premium = true 
    AND subscription_type IN ('early_adopter', 'quarterly');

-- Step 3: Update non-premium users
UPDATE premium_users
SET 
    subscription_type = 'none',
    subscription_end_date = NULL
WHERE 
    is_premium = false;
