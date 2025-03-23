// Script to check environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env');
console.log('Looking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('.env file exists');
  
  // Read the file content
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n.env file content (first line and key names only):');
  
  // Only show the first line and the names of the keys (not their values)
  const lines = envContent.split('\n');
  if (lines.length > 0) {
    console.log(lines[0]);
  }
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const keyName = line.substring(0, equalIndex);
      console.log(`${keyName}=***`);
    } else {
      console.log(line);
    }
  }
  
  // Load the environment variables
  dotenv.config({ path: envPath });
  
  // Check if specific variables are loaded
  console.log('\nEnvironment variables loaded in process.env:');
  const keysToCheck = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  keysToCheck.forEach(key => {
    if (process.env[key]) {
      console.log(`${key}: ${key.includes('KEY') ? '***' : process.env[key]}`);
    } else {
      console.log(`${key}: NOT FOUND`);
    }
  });
} else {
  console.error('.env file does not exist at the specified path');
}

console.log('\nDone checking environment variables.');
