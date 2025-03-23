const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// URL to test - this is a protected route that should trigger our error page
const TEST_URL = 'http://localhost:5173/profile';

(async () => {
  console.log('Starting test for authentication error page...');
  
  // Launch browser in debug mode
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true
  });
  
  // Create a new context
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  // Create a new page
  const page = await context.newPage();
  
  try {
    // Listen for console messages
    page.on('console', msg => {
      console.log(`BROWSER CONSOLE: ${msg.type()}: ${msg.text()}`);
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.error(`PAGE ERROR: ${error.message}`);
    });
    
    // Listen for request events
    page.on('request', request => {
      console.log(`REQUEST: ${request.method()} ${request.url()}`);
    });
    
    // Listen for response events
    page.on('response', response => {
      console.log(`RESPONSE: ${response.status()} ${response.url()}`);
    });
    
    console.log(`Navigating to protected route: ${TEST_URL}`);
    await page.goto(TEST_URL, { waitUntil: 'networkidle' });
    
    console.log('Checking if we see the authentication error page...');
    
    // Check if we're on the error page
    const errorHeading = await page.textContent('h1');
    console.log(`Page heading: ${errorHeading}`);
    
    // Check for login button
    const hasLoginButton = await page.isVisible('button:has-text("Go to Login")');
    console.log(`Login button visible: ${hasLoginButton}`);
    
    // Check for home button
    const hasHomeButton = await page.isVisible('button:has-text("Return to Home")');
    console.log(`Home button visible: ${hasHomeButton}`);
    
    if (hasLoginButton) {
      console.log('Clicking the "Go to Login" button...');
      await page.click('button:has-text("Go to Login")');
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if we're on the login page
      const currentUrl = page.url();
      console.log(`Current URL after clicking login: ${currentUrl}`);
      
      // Check if the redirectTo parameter is preserved
      if (currentUrl.includes('redirectTo=/profile')) {
        console.log('SUCCESS: redirectTo parameter is preserved in the URL!');
      } else {
        console.log('WARNING: redirectTo parameter is missing from the URL');
      }
    }
    
    // Keep the browser open for manual inspection
    console.log('\nTest completed. Browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close the browser and end the test.');
    
  } catch (error) {
    console.error('Error during test:', error);
  }
  
  // Don't close the browser to allow manual inspection
  // await browser.close();
})();
