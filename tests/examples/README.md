# Testing Examples for Swiftie App

This directory contains example tests that demonstrate different testing patterns and approaches for the Swiftie App. These examples are designed to serve as references when writing new tests.

## Component Test Examples

### Button Component Test

Located at: `tests/unit/examples/Button.spec.ts`

This example demonstrates:
- Testing a simple UI component with various props
- Verifying correct rendering of different variants and sizes
- Testing event handlers and disabled state
- Using the `safeRender` helper for compatibility with both classic and runes mode

Key techniques:
```typescript
// Using beforeEach to set up common test state
beforeEach(() => {
  renderResult = safeRender(Button, { label: 'Click me' });
});

// Testing event handlers with vi.fn()
const handleClick = vi.fn();
const { getByRole } = safeRender(Button, { 
  label: 'Click me', 
  onClick: handleClick 
});
await fireEvent.click(button);
expect(handleClick).toHaveBeenCalledTimes(1);
```

### Counter Component Test

Located at: `tests/unit/examples/Counter.spec.ts`

This example demonstrates:
- Testing a stateful component with user interactions
- Verifying state changes after user actions
- Testing component with Svelte 5 runes syntax

Key techniques:
```typescript
// Testing state changes after user interaction
const { getByText, getByRole } = renderResult;
const incrementButton = getByRole('button', { name: 'Increment' });
await fireEvent.click(incrementButton);
expect(getByText('Count: 1')).toBeInTheDocument();
```

## Service Test Examples

### AuthService Test

Located at: `tests/unit/examples/AuthService.spec.ts`

This example demonstrates:
- Mocking external dependencies (Supabase)
- Testing async service methods
- Testing success and error cases

Key techniques:
```typescript
// Mocking external dependencies
vi.mock('$lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

// Testing async methods with mocked responses
supabase.auth.signInWithPassword.mockResolvedValue({
  data: { user: { id: 'user-123' } },
  error: null
});

const result = await authService.signIn('test@example.com', 'password123');
expect(result.success).toBe(true);
```

## End-to-End Test Examples

### User Flow Test

Located at: `tests/e2e/examples/user-flow.spec.ts`

This example demonstrates:
- Testing a complete user journey
- Mocking API responses in Playwright
- Testing error states and edge cases

Key techniques:
```typescript
// Mocking API responses in Playwright
await page.route('**/auth/v1/signup', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({
      user: { id: 'test-id', email: testEmail },
      session: { access_token: 'fake-token' }
    })
  });
});

// Verifying UI state after actions
await page.getByRole('button', { name: 'Sign Up' }).click();
await expect(page).toHaveURL(/.*welcome/);
```

## Database Test Examples

### User Profile Tests

Located at: `tests/pgtap/examples/user_profile_tests.sql`

This example demonstrates:
- Testing database structure with pgTAP
- Verifying table columns and constraints
- Testing database functions

Key techniques:
```sql
-- Testing table structure
SELECT has_table('public', 'profiles', 'Profiles table should exist');
SELECT has_column('public', 'profiles', 'id', 'Profiles table should have id column');

-- Testing column types and constraints
SELECT col_type_is('public', 'profiles', 'id', 'uuid', 'id column should be type uuid');
SELECT col_is_pk('public', 'profiles', 'id', 'id column should be the primary key');

-- Testing functions
SELECT has_function(
    'public',
    'create_profile',
    ARRAY['uuid', 'text'],
    'create_profile function should exist with the correct parameters'
);
```

## Best Practices Demonstrated

1. **Test Isolation**: Each test is independent and doesn't rely on the state from other tests
2. **Descriptive Test Names**: Test names clearly describe what is being tested
3. **Arrange-Act-Assert Pattern**: Tests follow a clear setup, action, verification structure
4. **Mock External Dependencies**: External services are properly mocked
5. **Test Edge Cases**: Tests cover both happy paths and error cases
6. **Consistent Patterns**: Similar components are tested in similar ways

## Using These Examples

When writing new tests:

1. Find an example that closely matches your testing needs
2. Use it as a template for your new test
3. Adapt the patterns to your specific component or service
4. Follow the same best practices for readability and maintainability

Remember that these examples are meant to be educational. Your actual tests may need to be adapted based on the specific requirements of the component or service you're testing.
