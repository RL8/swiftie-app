# Testing Strategy for Swiftie App

This document outlines the testing approach for the Swiftie App, focusing on authentication and core functionality.

## Testing Structure

Our testing strategy has two main components:

1. **Component Tests**: Testing individual components in isolation using Vitest and Testing Library
2. **End-to-End Tests**: Testing full user flows with Playwright

## Running Tests

- `npm run test` - Run component tests with Vitest
- `npm run test:watch` - Run component tests in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:all` - Run all tests (both component and E2E)

## Test Organization

- `tests/e2e/` - Contains Playwright E2E tests
- `src/**/*.spec.ts` - Contains component tests alongside their components

## Development Workflow and Documentation

### Real-time Documentation Updates

The Swiftie App development workflow includes real-time integration with the documentation system:

1. **Documentation App Location**: `C:\Users\Bravo\CascadeProjects\swiftie-docs-simple`
   
2. **Real-time Updates**: All implementation plan changes must be reflected in real-time in the documentation app. The following steps must be followed:
   - Update the implementation plan in the main app
   - Update the corresponding documentation in the docs app
   - Ensure both systems are synchronized at all times

3. **Phase Completion Process**:
   - After completing each phase of implementation, open localhost to demonstrate the completed work
   - Wait for explicit approval before marking a phase as completed
   - Status changes (Pending → In-Progress → Completed) must only be triggered by the reviewer's approval
   - Never change a document's status without explicit reviewer approval

4. **Documentation Verification**:
   - Run both the main app and docs app locally to verify documentation updates
   - After each significant change, check that the docs app correctly reflects the current state

### Localhost Demonstration

For each phase of implementation:

1. Start the local development server with `npm run dev`
2. Open the application in a browser at the specified localhost port
3. Demonstrate the completed functionality for the phase
4. Only proceed to the next phase after receiving explicit approval

## Authentication Testing Strategy

Authentication testing is divided into several key areas:

1. **Login & Registration**
   - Validate form inputs and error messages
   - Test authentication flows with mock credentials
   - Verify redirects after successful authentication

2. **Protected Routes**
   - Ensure unauthenticated users are redirected to login
   - Verify authentication state is maintained between page navigation

3. **User Session Management**
   - Test persistent login after page refresh
   - Verify proper handling of session expiration

## Mocking Strategy

- Use Supabase mocks for authentication testing
- Mock user context for testing authenticated and unauthenticated states
- Mock API responses for testing data fetching components

## Best Practices

1. Test both success and failure paths
2. Test form validation extensively
3. Ensure UI responds correctly to different authentication states
4. Keep tests isolated and avoid dependencies between tests
5. Use descriptive test names that explain the behavior being tested

## Debugging Tests

To debug failing tests:
- For component tests: `npm run test:watch` and examine the output
- For E2E tests: Use Playwright's UI mode with `npx playwright test --ui`
