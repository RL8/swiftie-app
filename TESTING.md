# Comprehensive Testing Strategy for Swiftie App

This document outlines the complete testing approach for the Swiftie App, covering component testing, unit testing, and end-to-end (E2E) testing.

## Testing Philosophy

Our testing strategy follows these core principles:

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Maintain test independence**: Tests should not depend on each other
3. **Test at the right level**: Use the appropriate testing method for each part of the application
4. **Balance coverage and maintenance**: Aim for good coverage without creating brittle tests

## Testing Structure

Our testing approach has three main components:

1. **Component Tests**: Testing UI components in isolation using Vitest and Testing Library
2. **Unit Tests**: Testing services, utilities, and business logic with Vitest
3. **End-to-End Tests**: Testing complete user flows with Playwright

## Test Organization

- `tests/unit/` - Contains unit and component tests
- `tests/e2e/` - Contains Playwright E2E tests
- `tests/pgtap/` - Contains database tests using pgTAP

## Running Tests

```bash
# Run component and unit tests
npm run test

# Run component and unit tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run end-to-end tests with UI
npm run test:e2e:ui

# Run all tests (unit, component, and E2E)
npm run test:all

# Run tests with coverage report
npm run test:coverage
```

## Component Testing

Component tests verify that UI components render correctly and respond appropriately to user interactions.

### Key Tools
- **Vitest**: Test runner
- **@testing-library/svelte**: Utilities for testing Svelte components
- **@testing-library/jest-dom**: Custom DOM matchers

### Example Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from '../src/lib/components/ui/Button.svelte';

describe('Button Component', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button, { label: 'Click me' });
    const button = getByRole('button');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });
  
  it('fires click event when clicked', async () => {
    let clicked = false;
    
    const { getByRole } = render(Button, {
      label: 'Click me',
      onClick: () => { clicked = true; }
    });
    
    const button = getByRole('button');
    await fireEvent.click(button);
    
    expect(clicked).toBe(true);
  });
});
```

### Testing Svelte 5 Runes Components

When testing components that use Svelte 5 runes, use the `safeRender` helper from `tests/helpers.ts`:

```typescript
import { safeRender } from '../../helpers';
import Counter from '../../../src/lib/components/examples/Counter.svelte';

describe('Counter Component', () => {
  it('renders with initial count of 0', () => {
    const { getByText } = safeRender(Counter);
    expect(getByText('Count: 0')).toBeInTheDocument();
  });
});
```

## Unit Testing

Unit tests verify that individual functions, services, and utilities work correctly in isolation.

### Key Areas to Unit Test

1. **Services**: Classes that encapsulate business logic or API calls
2. **Utilities**: Helper functions and pure functions
3. **Stores**: Svelte stores and state management
4. **Hooks**: Custom hooks and reactive logic

### Example Unit Test

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../src/lib/services/AuthService';

// Mock the Supabase client
vi.mock('$lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}));

// Import the mocked client
import { supabase } from '$lib/supabase/client';

describe('AuthService', () => {
  let authService;
  
  beforeEach(() => {
    vi.resetAllMocks();
    authService = new AuthService();
  });
  
  it('should successfully sign in with valid credentials', async () => {
    // Mock successful sign in
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    });
    
    const result = await authService.signIn('test@example.com', 'password123');
    
    expect(result.success).toBe(true);
  });
});
```

## End-to-End Testing

E2E tests verify that complete user flows work correctly from the user's perspective.

### Key Tools
- **Playwright**: Browser automation framework

### Key User Flows to Test

1. **Authentication**: Registration, login, logout
2. **Navigation**: Moving between different parts of the app
3. **Core Features**: Testing the main features of the application
4. **Error Handling**: Testing how the app handles errors

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('should allow a user to login and view their profile', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in login credentials
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  
  // Click login button
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Check redirect to dashboard after successful login
  await expect(page).toHaveURL('/dashboard');
  
  // Navigate to profile
  await page.getByRole('link', { name: 'Profile' }).click();
  
  // Verify profile information is displayed
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

## Mocking Strategy

### Mocking Supabase

```typescript
// In test file
vi.mock('$lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { /* mock data */ },
            error: null
          })
        })
      })
    })
  }
}));
```

### Mocking API Responses in E2E Tests

```typescript
// In Playwright test
await page.route('**/api/data', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ 
      success: true,
      data: [/* mock data */] 
    })
  });
});
```

## Database Testing with pgTAP

For testing database functions, triggers, and policies, we use pgTAP.

### Running Database Tests

```bash
# Run all database tests
psql -d your_database -f tests/pgtap/run_all_tests.sql

# Run specific test file
psql -d your_database -f tests/pgtap/01_table_structure.sql
```

## Testing Best Practices

1. **Write tests before fixing bugs**: Create a test that reproduces the bug, then fix it
2. **Keep tests focused**: Each test should verify one specific behavior
3. **Use descriptive test names**: Names should describe the behavior being tested
4. **Test edge cases**: Include tests for boundary conditions and error states
5. **Maintain test independence**: Tests should not depend on the state from other tests
6. **Clean up after tests**: Reset any global state or mocks after each test
7. **Avoid testing implementation details**: Focus on behavior, not internal workings

## Debugging Tests

### Component and Unit Tests

```bash
# Run tests in watch mode for faster debugging
npm run test:watch

# Focus on a specific test file
npm run test:watch -- Button.spec.ts
```

### E2E Tests

```bash
# Run E2E tests with UI for visual debugging
npm run test:e2e:ui

# Run a specific E2E test
npx playwright test auth.spec.ts
```

## Continuous Integration

Tests are automatically run in the CI pipeline on:
- Pull requests to main branch
- Pushes to main branch

The pipeline will fail if any tests fail, preventing broken code from being merged.
