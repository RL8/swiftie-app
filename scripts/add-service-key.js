// Script to add the Supabase service role key to the .env file
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import readline from 'readline';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to .env file
const envPath = resolve(__dirname, '..', '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('.env file not found at:', envPath);
  console.error('Please create a .env file in the project root first.');
  rl.close();
  process.exit(1);
}

console.log('This script will add or update the SUPABASE_SERVICE_ROLE_KEY in your .env file.');
console.log('You can find this key in your Supabase dashboard under Project Settings > API.');
console.log('Look for the "service_role key" (not the anon/public key).\n');

// Prompt for the service role key
rl.question('Please enter your Supabase service role key: ', (serviceKey) => {
  if (!serviceKey || serviceKey.trim() === '') {
    console.error('No key provided. Operation cancelled.');
    rl.close();
    return;
  }

  try {
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if the key already exists
    const keyExists = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=');
    
    if (keyExists) {
      // Replace the existing key
      envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*/,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
      );
      console.log('Existing SUPABASE_SERVICE_ROLE_KEY updated.');
    } else {
      // Add the key to the end of the file
      // Make sure there's a newline at the end
      if (!envContent.endsWith('\n')) {
        envContent += '\n';
      }
      envContent += `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}\n`;
      console.log('SUPABASE_SERVICE_ROLE_KEY added to .env file.');
    }
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\nService role key has been successfully added to your .env file.');
    console.log('IMPORTANT: You may need to restart your terminal or IDE for the changes to take effect.');
    
  } catch (error) {
    console.error('Error updating .env file:', error.message);
  } finally {
    rl.close();
  }
});

// Handle the close event
rl.on('close', () => {
  console.log('Done!');
  process.exit(0);
});
