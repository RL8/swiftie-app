// Setup file for Vitest tests
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';
import { mockSupabase, mockUserContext } from './helpers';

// Mock Svelte lifecycle functions
vi.mock('svelte', async () => {
  const mocks = await import('../src/mocks/svelte');
  return mocks;
});

// Mock SvelteKit modules
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: { subscribe: vi.fn() },
  navigating: { subscribe: vi.fn() },
  updated: { subscribe: vi.fn() }
}));

// Mock Supabase client
vi.mock('$lib/supabase/client', () => mockSupabase());

// Mock user context
vi.mock('$lib/context/user.svelte', () => mockUserContext());

// Add custom jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
