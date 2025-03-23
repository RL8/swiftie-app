import { test, expect } from '@playwright/test';
import { mockStripePayment } from '../helpers';

test.describe('Payment Flow', () => {
  test('User can navigate to premium page and see payment options', async ({ page }) => {
    // First login to access premium page
    await page.goto('/login');
    
    // Fill in login form (assuming these fields exist)
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to the premium page
    await page.goto('/premium');
    
    // Verify the page loads with payment options
    await expect(page.locator('h1:has-text("Premium Access")')).toBeVisible();
    
    // Check if at least one payment option is visible
    const quarterlyButton = page.getByText('Subscribe Now');
    const earlyAdopterButton = page.getByText('Get Lifetime Access');
    
    const hasPaymentOption = await Promise.race([
      quarterlyButton.isVisible().then(visible => visible),
      earlyAdopterButton.isVisible().then(visible => visible),
      new Promise(resolve => setTimeout(() => resolve(false), 5000))
    ]);
    
    expect(hasPaymentOption).toBeTruthy();
  });
});
