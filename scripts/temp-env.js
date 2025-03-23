// Script to add the service role key to the .env file
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import readline from 'readline';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the .env file
const envPath = resolve(__dirname, '..', '.env');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for the service role key
console.log('Please enter your Supabase service role key:');
console.log('You can find this in your Supabase project settings under "API" > "Project API keys" > "service_role"');
console.log('This key will be added to your .env file.\n');

rl.question('SUPABASE_SERVICE_ROLE_KEY=', (serviceRoleKey) => {
  // Read the current .env file
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if the key already exists
    if (envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')) {
      // Replace the existing key
      envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*/,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
      );
      console.log('Replaced existing SUPABASE_SERVICE_ROLE_KEY in .env file.');
    } else {
      // Add the key to the end of the file
      envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}\n`;
      console.log('Added SUPABASE_SERVICE_ROLE_KEY to .env file.');
    }
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);
    console.log('Successfully updated .env file.');
  } else {
    console.error('.env file not found. Please create one in the project root.');
  }
  
  rl.close();
});
