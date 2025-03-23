// Mock SvelteKit modules for testing
import { vi } from 'vitest';

// Mock $app/navigation
export const goto = vi.fn();
export const invalidate = vi.fn();
export const preloadData = vi.fn();
export const beforeNavigate = vi.fn();
export const afterNavigate = vi.fn();

// Mock $app/forms
export const enhance = vi.fn((form, options) => {
  return {
    destroy: vi.fn()
  };
});
export const applyAction = vi.fn();

// Mock $app/stores
export const page = {
  subscribe: vi.fn((callback) => {
    callback({
      url: new URL('http://localhost'),
      params: {},
      route: {
        id: '/'
      },
      status: 200,
      error: null,
      data: {},
      form: null
    });
    return () => {};
  })
};

export const navigating = {
  subscribe: vi.fn((callback) => {
    callback(null);
    return () => {};
  })
};

export const updated = {
  subscribe: vi.fn((callback) => {
    callback(false);
    return () => {};
  }),
  check: vi.fn()
};

// Mock $app/environment
export const browser = true;
export const dev = true;
export const building = false;
export const version = '1.0.0';
