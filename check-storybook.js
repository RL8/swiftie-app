const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console events
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type}] ${text}`);
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.error(`Page error: ${error.message}`);
  });
  
  // Navigate to Storybook
  try {
    await page.goto('http://localhost:6006');
    console.log('Page loaded successfully');
    await page.waitForTimeout(5000); // Wait for 5 seconds to capture logs
  } catch (error) {
    console.error(`Navigation failed: ${error.message}`);
  }
  
  await browser.close();
})();
