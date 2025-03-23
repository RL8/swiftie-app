import { test, expect } from '@playwright/test';

// Example of a complete user flow test
test.describe('User Registration and Profile Flow', () => {
  // Use a unique email for each test run to avoid conflicts
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  
  test('should allow a user to register, login, and update profile', async ({ page }) => {
    // Step 1: Navigate to signup page
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Create a Swiftie Account' })).toBeVisible();
    
    // Step 2: Fill out registration form
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByLabel('Name').fill(testName);
    
    // Step 3: Submit registration form
    // Note: We'll use a test interceptor to avoid actually creating accounts
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'test-id', email: testEmail },
          session: { access_token: 'fake-token' }
        })
      });
    });
    
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Step 4: Verify redirect to welcome page
    await expect(page).toHaveURL(/.*welcome/);
    
    // Step 5: Navigate to profile page
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/.*profile/);
    
    // Step 6: Verify profile information is displayed
    await expect(page.getByText(testEmail)).toBeVisible();
    await expect(page.getByText(testName)).toBeVisible();
    
    // Step 7: Update profile information
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await page.getByLabel('Display Name').fill('Updated Name');
    
    // Mock the profile update API call
    await page.route('**/rest/v1/profiles*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ id: 'test-id', name: 'Updated Name' })
      });
    });
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    
    // Step 8: Verify profile was updated
    await expect(page.getByText('Updated Name')).toBeVisible();
    
    // Step 9: Sign out
    await page.getByRole('button', { name: 'Sign Out' }).click();
    
    // Step 10: Verify redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });
});

// Example of testing error states
test.describe('Error Handling', () => {
  test('should display appropriate error when login fails', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form with invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Mock the failed login API response
    await page.route('**/auth/v1/token*', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          error: 'Invalid login credentials',
          error_description: 'Email or password is incorrect'
        })
      });
    });
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify error message is displayed
    await expect(page.getByText('Email or password is incorrect')).toBeVisible();
  });
});
