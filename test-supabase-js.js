// Test script for Supabase API using JavaScript client

import { createClient } from '@supabase/supabase-js';

// Supabase project details
const supabaseUrl = 'https://wnaxmgtrdhlousolblcr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduYXhtZ3RyZGhsb3Vzb2xibGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQ5MzczOCwiZXhwIjoyMDIzMDY5NzM4fQ.Bz_PZgvpyQZBCgBqvLdVgj2xvZ0FwNQfYpCQTXPPBSg';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to query the profiles table
async function testProfiles() {
  try {
    console.log('Fetching profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    console.log(`Successfully retrieved ${data.length} profiles:`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
testProfiles();
