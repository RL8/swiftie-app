// Enhanced browser debug script for all browser preview sessions
import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import readline from 'readline';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file found at:', envPath);
  dotenv.config({ path: envPath });
}

// Parse command line arguments
const args = process.argv.slice(2);
const url = args[0] || 'http://localhost:5174';
const email = args[1] || '';
const password = args[2] || '';

// Create readline interface for interactive commands
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startDebugSession() {
  console.log(`Starting debug browser session for URL: ${url}`);
  
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
    const type = msg.type();
    // Color-code different types of console messages
    let prefix = '';
    switch(type) {
      case 'error': prefix = '\x1b[31m[ERROR]\x1b[0m'; break;
      case 'warning': prefix = '\x1b[33m[WARNING]\x1b[0m'; break;
      case 'info': prefix = '\x1b[36m[INFO]\x1b[0m'; break;
      default: prefix = `\x1b[32m[${type.toUpperCase()}]\x1b[0m`;
    }
    console.log(`${prefix} ${msg.text()}`);
  });
  
  // Listen for all network requests
  page.on('request', request => {
    const url = request.url();
    // Only log Supabase and app-related requests to reduce noise
    if (url.includes('supabase') || !url.includes('node_modules')) {
      console.log(`\x1b[34m[NETWORK REQUEST]\x1b[0m ${request.method()} ${url}`);
      
      // Log request headers and body for API calls
      if (url.includes('supabase') && request.method() !== 'GET') {
        try {
          const headers = request.headers();
          const postData = request.postData();
          if (postData) {
            console.log('Request body:', postData);
          }
        } catch (e) {
          // Ignore errors in request logging
        }
      }
    }
  });
  
  // Listen for all network responses
  page.on('response', async response => {
    const url = response.url();
    // Only log Supabase and app-related responses
    if (url.includes('supabase') || !url.includes('node_modules')) {
      const status = response.status();
      // Color status code based on type
      let statusText = '';
      if (status >= 200 && status < 300) {
        statusText = `\x1b[32m${status}\x1b[0m`; // Green for success
      } else if (status >= 400) {
        statusText = `\x1b[31m${status}\x1b[0m`; // Red for error
      } else {
        statusText = `\x1b[33m${status}\x1b[0m`; // Yellow for others
      }
      
      console.log(`\x1b[35m[NETWORK RESPONSE]\x1b[0m ${statusText} ${url}`);
      
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          const responseBody = await response.json().catch(() => ({}));
          console.log('\x1b[36m[RESPONSE BODY]\x1b[0m', JSON.stringify(responseBody, null, 2));
        }
      } catch (error) {
        // Ignore errors in response logging
      }
    }
  });
  
  // Navigate to the specified URL
  await page.goto(url);
  console.log(`Navigated to ${url}`);
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // If email and password are provided, attempt to log in
  if (email && password) {
    console.log(`Attempting to log in with email: ${email}`);
    
    // Wait for the login form to be available
    await page.waitForSelector('input#email', { timeout: 5000 }).catch(() => {
      console.log('Login form not found on this page');
    });
    
    // If login form is found, fill it in
    if (await page.$('input#email') !== null) {
      await page.fill('input#email', email);
      await page.fill('input#password', password);
      console.log('Filled login form');
      
      // Click the login button
      console.log('Clicking login button...');
      await page.click('button[type="submit"]');
      
      // Wait for navigation or timeout
      await Promise.race([
        page.waitForNavigation().catch(() => null),
        new Promise(resolve => setTimeout(resolve, 5000))
      ]);
      
      // Report current URL
      console.log('Current URL after login attempt:', page.url());
    }
  }
  
  // Print interactive commands help
  console.log('\n\x1b[1mInteractive Debug Commands:\x1b[0m');
  console.log('  url <url> - Navigate to a new URL');
  console.log('  login <email> <password> - Attempt to log in');
  console.log('  click <selector> - Click an element');
  console.log('  fill <selector> <value> - Fill a form field');
  console.log('  eval <js> - Evaluate JavaScript in the page context');
  console.log('  storage - Show localStorage contents');
  console.log('  cookies - Show cookies');
  console.log('  screenshot - Take a screenshot');
  console.log('  exit - Close browser and exit\n');
  
  // Handle interactive commands
  rl.on('line', async (input) => {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    
    try {
      switch (command) {
        case 'url':
          if (parts[1]) {
            await page.goto(parts[1]);
            console.log(`Navigated to ${parts[1]}`);
          } else {
            console.log('Current URL:', page.url());
          }
          break;
          
        case 'login':
          if (parts[1] && parts[2]) {
            await page.fill('input#email', parts[1]);
            await page.fill('input#password', parts[2]);
            await page.click('button[type="submit"]');
            console.log('Login attempted');
          } else {
            console.log('Usage: login <email> <password>');
          }
          break;
          
        case 'click':
          if (parts[1]) {
            await page.click(parts[1]);
            console.log(`Clicked ${parts[1]}`);
          } else {
            console.log('Usage: click <selector>');
          }
          break;
          
        case 'fill':
          if (parts[1] && parts[2]) {
            await page.fill(parts[1], parts.slice(2).join(' '));
            console.log(`Filled ${parts[1]}`);
          } else {
            console.log('Usage: fill <selector> <value>');
          }
          break;
          
        case 'eval':
          if (parts.length > 1) {
            const js = parts.slice(1).join(' ');
            const result = await page.evaluate(js);
            console.log('Result:', result);
          } else {
            console.log('Usage: eval <javascript>');
          }
          break;
          
        case 'storage':
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
            console.log(`- ${key}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
          }
          break;
          
        case 'cookies':
          const cookies = await context.cookies();
          console.log('Cookies:');
          cookies.forEach(cookie => {
            console.log(`- ${cookie.name}: ${cookie.value.substring(0, 20)}${cookie.value.length > 20 ? '...' : ''}`);
          });
          break;
          
        case 'screenshot':
          const path = `screenshot-${Date.now()}.png`;
          await page.screenshot({ path });
          console.log(`Screenshot saved to ${path}`);
          break;
          
        case 'exit':
          await browser.close();
          rl.close();
          process.exit(0);
          break;
          
        default:
          console.log('Unknown command. Type "help" for available commands.');
      }
    } catch (error) {
      console.error('Error executing command:', error.message);
    }
  });
  
  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('Closing browser...');
    await browser.close();
    process.exit(0);
  });
}

// Run the debug function
startDebugSession().catch(error => {
  console.error('Error in debug script:', error);
  process.exit(1);
});
