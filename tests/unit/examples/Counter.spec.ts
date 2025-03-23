import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Counter from '../../../src/lib/components/examples/Counter.svelte';
import { safeRender } from '../../helpers';

describe('Counter Component', () => {
  let renderResult;

  beforeEach(() => {
    // Use safeRender to handle both classic and runes mode components
    renderResult = safeRender(Counter);
  });

  it('renders with initial count of 0', () => {
    const { getByText } = renderResult;
    expect(getByText('Count: 0')).toBeInTheDocument();
  });

  it('increments count when increment button is clicked', async () => {
    const { getByText, getByRole } = renderResult;
    
    // Find the increment button and click it
    const incrementButton = getByRole('button', { name: 'Increment' });
    await fireEvent.click(incrementButton);
    
    // Check if the count was incremented
    expect(getByText('Count: 1')).toBeInTheDocument();
  });

  it('decrements count when decrement button is clicked', async () => {
    const { getByText, getByRole } = renderResult;
    
    // First increment to 1
    const incrementButton = getByRole('button', { name: 'Increment' });
    await fireEvent.click(incrementButton);
    
    // Then decrement back to 0
    const decrementButton = getByRole('button', { name: 'Decrement' });
    await fireEvent.click(decrementButton);
    
    // Check if the count was decremented
    expect(getByText('Count: 0')).toBeInTheDocument();
  });

  it('does not decrement below 0', async () => {
    const { getByText, getByRole } = renderResult;
    
    // Try to decrement when count is already 0
    const decrementButton = getByRole('button', { name: 'Decrement' });
    await fireEvent.click(decrementButton);
    
    // Check that count is still 0
    expect(getByText('Count: 0')).toBeInTheDocument();
  });

  it('resets count when reset button is clicked', async () => {
    const { getByText, getByRole } = renderResult;
    
    // First increment a few times
    const incrementButton = getByRole('button', { name: 'Increment' });
    await fireEvent.click(incrementButton);
    await fireEvent.click(incrementButton);
    
    // Check that count is 2
    expect(getByText('Count: 2')).toBeInTheDocument();
    
    // Reset the count
    const resetButton = getByRole('button', { name: 'Reset' });
    await fireEvent.click(resetButton);
    
    // Check that count is back to 0
    expect(getByText('Count: 0')).toBeInTheDocument();
  });
});
