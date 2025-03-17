import { test, expect } from '@playwright/test';

// Test suite for authentication features
test.describe('Authentication', () => {
  
  // Test the login page
  test('should display login form', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Check if the login form elements are visible
    await expect(page.getByRole('heading', { name: 'Sign in to Swiftie App' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
  
  // Test navigation to signup page
  test('should navigate to signup page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Click on the signup link
    await page.getByRole('link', { name: 'Create an account' }).click();
    
    // Check if we're on the signup page
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: 'Create a Swiftie Account' })).toBeVisible();
  });
  
  // Test unauthenticated redirect
  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to navigate to a protected page without authentication
    await page.goto('/profile');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });
  
  // Test successful login
  test.skip('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login credentials - replace with test credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Click login button
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check redirect to feed page after successful login
    await expect(page).toHaveURL('/feed');
    
    // Check if navigation shows authenticated options
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
  });
});
