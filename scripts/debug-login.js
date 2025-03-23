// Debug script to test login functionality and capture console output
import { chromium } from 'playwright';
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
  console.log('.env file found at:', envPath);
  dotenv.config({ path: envPath });
}

// Test user credentials - you can modify these or pass them as arguments
const testUser = {
  email: process.argv[2] || 'testuserfa2ed328@gmail.com',
  password: process.argv[3] || 'password123'
};

async function debugLogin() {
  console.log(`Starting debug session for login with email: ${testUser.email}`);
  
  // Launch browser with dev tools open
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  // Create a new context
  const context = await browser.newContext();
  
  // Create a new page
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  // Listen for all network requests
  page.on('request', request => {
    if (request.url().includes('supabase')) {
      console.log(`NETWORK REQUEST: ${request.method()} ${request.url()}`);
    }
  });
  
  // Listen for all network responses
  page.on('response', async response => {
    if (response.url().includes('supabase')) {
      console.log(`NETWORK RESPONSE: ${response.status()} ${response.url()}`);
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          const responseBody = await response.json().catch(() => ({}));
          console.log('RESPONSE BODY:', JSON.stringify(responseBody, null, 2));
        }
      } catch (error) {
        console.log('Error parsing response:', error.message);
      }
    }
  });
  
  // Navigate to the login page
  await page.goto('http://localhost:5174/login');
  console.log('Navigated to login page');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Fill in the login form
  await page.fill('#email', testUser.email);
  await page.fill('#password', testUser.password);
  console.log('Filled login form');
  
  // Click the login button and wait for navigation or network activity
  console.log('Clicking login button...');
  
  // Create a promise that will resolve when navigation occurs or timeout after 5 seconds
  const navigationPromise = Promise.race([
    page.waitForNavigation().catch(() => null),
    new Promise(resolve => setTimeout(resolve, 5000))
  ]);
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Wait for either navigation or timeout
  await navigationPromise;
  
  // Check if we're still on the login page
  const currentUrl = page.url();
  console.log('Current URL after login attempt:', currentUrl);
  
  if (currentUrl.includes('/login')) {
    console.log('Still on login page - login might have failed');
    
    // Check for visible error messages
    const errorText = await page.textContent('.bg-red-100').catch(() => null);
    if (errorText) {
      console.log('Error message displayed:', errorText);
    } else {
      console.log('No visible error message found');
    }
  } else {
    console.log('Navigation successful - login appears to have worked');
  }
  
  // Check local storage for auth tokens
  const localStorage = await page.evaluate(() => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key);
    }
    return items;
  });
  
  console.log('LocalStorage items:');
  for (const [key, value] of Object.entries(localStorage)) {
    if (key.includes('supabase')) {
      console.log(`- ${key}: ${value.substring(0, 50)}...`);
    }
  }
  
  // Check cookies
  const cookies = await context.cookies();
  console.log('Cookies:');
  cookies.forEach(cookie => {
    if (cookie.name.includes('supabase')) {
      console.log(`- ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
    }
  });
  
  // Keep the browser open for manual inspection
  console.log('\nBrowser will remain open for manual inspection.');
  console.log('Press Ctrl+C to close the browser and end the script.');
  
  // Wait for user to manually close with Ctrl+C
  await new Promise(() => {});
}

// Run the debug function
debugLogin().catch(error => {
  console.error('Error in debug script:', error);
  process.exit(1);
});
