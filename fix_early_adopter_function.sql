-- Fix the naming conflict in the increment_early_adopter_count function
CREATE OR REPLACE FUNCTION increment_early_adopter_count()
RETURNS INTEGER AS $$
DECLARE
  current_count_val INTEGER;
  max_count_val INTEGER;
BEGIN
  -- Get current values
  SELECT e.current_count, e.max_count INTO current_count_val, max_count_val
  FROM early_adopter_count e
  WHERE id = 1;
  
  -- Check if we've reached the maximum
  IF current_count_val >= max_count_val THEN
    RETURN -1; -- Indicates we've reached the maximum
  END IF;
  
  -- Increment the count
  UPDATE early_adopter_count
  SET current_count = current_count + 1,
      updated_at = NOW()
  WHERE id = 1;
  
  -- Return the new count
  RETURN current_count_val + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
