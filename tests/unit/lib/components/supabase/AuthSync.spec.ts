import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthSync from '../../../../../src/lib/components/supabase/AuthSync.svelte';
import { safeRender } from '../../../../../tests/helpers';

describe('AuthSync Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should render without errors', () => {
    const { container } = safeRender(AuthSync);
    expect(container).toBeTruthy();
  });
});
