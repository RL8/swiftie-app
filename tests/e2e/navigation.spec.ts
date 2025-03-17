import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  // Test homepage navigation
  test('should navigate to homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    // Check for homepage content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  // Test navigation menu for unauthenticated users
  test('should show login/signup links for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Navigation should show login and signup links for unauthenticated users
    const navigation = page.locator('nav');
    await expect(navigation.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  // Test protected routes
  test('should redirect from protected routes when not authenticated', async ({ page }) => {
    // Try accessing feed (protected)
    await page.goto('/feed');
    // Should redirect to login with return URL
    await expect(page).toHaveURL(/.*login.*redirectTo.*/);
    
    // Try accessing profile (protected)
    await page.goto('/profile');
    // Should redirect to login with return URL
    await expect(page).toHaveURL(/.*login.*redirectTo.*/);
  });
});
