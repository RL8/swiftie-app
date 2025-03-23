import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRender } from '../../helpers';
import { get } from 'svelte/store';

// Mock the necessary modules
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$app/environment', () => ({
  browser: true
}));

// Mock fetch for API calls
global.fetch = vi.fn();

describe('Payment Flow', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock successful API responses
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/premium/status')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ isPremium: false })
        });
      }
      
      if (url.includes('/api/payments/early-adopter-status')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            isAvailable: true,
            remainingSpots: 500,
            totalSpots: 1989
          })
        });
      }
      
      if (url.includes('/api/payments/create-intent')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            clientSecret: 'mock_client_secret'
          })
        });
      }
      
      return Promise.reject(new Error(`Unhandled fetch mock for URL: ${url}`));
    });
  });
  
  it('should verify payment options are displayed correctly', async () => {
    // Import the component dynamically to ensure mocks are set up first
    const PremiumPage = await import('../../../src/routes/premium/+page.svelte');
    
    // Mock the page store
    const mockPageStore = {
      subscribe: vi.fn().mockImplementation((callback) => {
        callback({ data: { session: { user: { id: 'mock-user-id' } } } });
        return () => {};
      })
    };
    
    vi.stubGlobal('$page', mockPageStore);
    
    // Render the component
    const { container, component } = safeRender(PremiumPage.default);
    
    // Wait for onMount to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify payment options are displayed
    const earlyAdopterOption = container.querySelector('.border-purple-500');
    const quarterlyOption = container.querySelector('.bg-gray-800');
    
    expect(earlyAdopterOption).toBeTruthy();
    expect(quarterlyOption).toBeTruthy();
    
    // Verify button texts
    const earlyAdopterButton = container.querySelector('.border-purple-500 button');
    const quarterlyButton = container.querySelector('.bg-gray-800 + div button');
    
    expect(earlyAdopterButton?.textContent?.trim()).toContain('Get Lifetime Access');
    expect(quarterlyButton?.textContent?.trim()).toContain('Subscribe Now');
  });
  
  it('should call handlePurchase when payment button is clicked', async () => {
    // Import the component dynamically to ensure mocks are set up first
    const PremiumPage = await import('../../../src/routes/premium/+page.svelte');
    
    // Mock the page store
    const mockPageStore = {
      subscribe: vi.fn().mockImplementation((callback) => {
        callback({ data: { session: { user: { id: 'mock-user-id' } } } });
        return () => {};
      })
    };
    
    vi.stubGlobal('$page', mockPageStore);
    
    // Mock goto function
    const goto = vi.fn();
    vi.stubGlobal('goto', goto);
    
    // Render the component
    const { container, component } = safeRender(PremiumPage.default);
    
    // Wait for onMount to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find and click the early adopter button
    const earlyAdopterButton = container.querySelector('.border-purple-500 button');
    
    if (earlyAdopterButton) {
      // Simulate click
      await earlyAdopterButton.click();
      
      // Verify fetch was called to create payment intent
      expect(global.fetch).toHaveBeenCalledWith('/api/payments/create-intent', expect.any(Object));
      
      // Verify goto was called with the correct URL
      expect(goto).toHaveBeenCalledWith(expect.stringContaining('/premium/checkout?client_secret=mock_client_secret'));
    } else {
      throw new Error('Early adopter button not found');
    }
  });
});
