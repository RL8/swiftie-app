// Mock Svelte module for testing purposes
// This handles both classic mode and runes mode components

import { vi } from 'vitest';

// Mock lifecycle functions
export const onMount = vi.fn((callback) => callback());
export const beforeUpdate = vi.fn();
export const afterUpdate = vi.fn();
export const onDestroy = vi.fn();
export const tick = vi.fn().mockResolvedValue(undefined);

// Mock context functions
export const getContext = vi.fn();
export const setContext = vi.fn();
export const hasContext = vi.fn();

// Mock mount function for Svelte 5 compatibility with testing-library
export const mount = vi.fn((component, { target, props = {} } = {}) => {
  const instance = {
    $set: vi.fn(),
    $on: vi.fn(),
    $destroy: vi.fn()
  };
  return instance;
});

// Mock unmount function for Svelte 5 compatibility
export const unmount = vi.fn();

// Mock flushSync function for Svelte 5 compatibility
export const flushSync = vi.fn((fn) => {
  if (typeof fn === 'function') {
    return fn();
  }
  return undefined;
});

// Mock stores
export const writable = (value) => {
  const subscribers = new Set();
  let current = value;
  
  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
    subscriber(current);
    
    return () => {
      subscribers.delete(subscriber);
    };
  };
  
  const set = (value) => {
    current = value;
    subscribers.forEach(subscriber => subscriber(current));
  };
  
  const update = (fn) => {
    set(fn(current));
  };
  
  return { subscribe, set, update };
};

export const readable = (value, start) => {
  const store = writable(value);
  
  if (start) {
    const stop = start(store.set);
    
    if (typeof stop === 'function') {
      return {
        subscribe: store.subscribe
      };
    }
  }
  
  return { subscribe: store.subscribe };
};

export const derived = writable;

// Svelte 5 runes support
export const state = (initialValue) => initialValue;
export const derived$ = vi.fn((deps, fn) => fn(deps));
export const effect = vi.fn((callback) => {
  callback();
  return () => {};
});
export const untrack = vi.fn((fn) => fn());
export const render = vi.fn();
export const mounted = vi.fn();
export const beforeRender = vi.fn();
export const afterRender = vi.fn();

// Export these as both functions and properties for different import styles
export const $state = state;
export const $derived = derived$;
export const $effect = effect;
export const $untrack = untrack;
export const $render = render;
export const $mounted = mounted;
export const $beforeRender = beforeRender;
export const $afterRender = afterRender;
