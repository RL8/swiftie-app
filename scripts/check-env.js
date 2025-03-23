// Script to check for required environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('.env file found.');
} else {
  console.error('.env file not found. Please create one in the project root.');
  process.exit(1);
}

// Check for required environment variables
const requiredVars = [
  'PUBLIC_SUPABASE_URL',
  'PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const missingVars = [];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.log('\nMissing environment variables:');
  missingVars.forEach(varName => {
    console.log(`- ${varName}`);
  });
  
  console.log('\nPlease add these variables to your .env file. Example:');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_${varName.toLowerCase()}_here`);
  });
} else {
  console.log('\nAll required environment variables are present.');
  
  // Print partial values for verification (hiding most characters)
  console.log('\nEnvironment variable verification:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '********';
    console.log(`- ${varName}: ${maskedValue}`);
  });
}
