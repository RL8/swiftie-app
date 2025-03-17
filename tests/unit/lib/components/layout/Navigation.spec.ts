import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navigation from '../../../../../src/lib/components/layout/Navigation.svelte';
import { safeRender } from '../../../../../tests/helpers';

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should render navigation elements', () => {
    const { container } = safeRender(Navigation);
    expect(container).toBeTruthy();
  });
});
