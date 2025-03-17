import { test, expect } from '@playwright/test';

test.describe('Signup Process', () => {
  test('should display signup form', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/signup');
    
    // Check if form elements are visible
    await expect(page.getByRole('heading', { name: 'Create a Swiftie Account' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });
  
  test('should validate form inputs', async ({ page }) => {
    await page.goto('/signup');
    
    // Submit empty form
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    
    // Test invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
    
    // Test password mismatch
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('different-password');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
  
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/signup');
    
    // Click on the login link
    await page.getByRole('link', { name: 'Already have an account?' }).click();
    
    // Check if redirected to login page
    await expect(page).toHaveURL('/login');
  });
  
  // Note: This test is skipped because it would create a real user
  test.skip('should create a new account with valid information', async ({ page }) => {
    // This test would be implemented in a real testing environment
    // with proper test data management and clean-up
  });
});
