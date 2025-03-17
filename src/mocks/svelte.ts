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
