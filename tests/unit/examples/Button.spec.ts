import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent } from '@testing-library/svelte';
import Button from '../../../src/lib/components/ui/Button.svelte';
import { safeRender } from '../../helpers';

describe('Button Component', () => {
  let renderResult;

  beforeEach(() => {
    // Use safeRender to handle both classic and runes mode components
    renderResult = safeRender(Button, { label: 'Click me' });
  });

  it('renders with the correct label', () => {
    const { container } = renderResult;
    const button = container.querySelector('button');
    
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Click me');
  });

  it('applies the correct variant class', () => {
    // Re-render with a different variant
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      variant: 'secondary' 
    });
    
    const button = container.querySelector('button');
    expect(button.classList.contains('btn-secondary')).toBe(true);
  });

  it('applies the correct size class', () => {
    // Re-render with a different size
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      size: 'large' 
    });
    
    const button = container.querySelector('button');
    expect(button.classList.contains('btn-large')).toBe(true);
  });

  it('can be disabled', () => {
    // Re-render with disabled state
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      disabled: true 
    });
    
    const button = container.querySelector('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('applies full width class when specified', () => {
    // Re-render with full width
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      fullWidth: true 
    });
    
    const button = container.querySelector('button');
    expect(button.classList.contains('btn-full')).toBe(true);
  });

  it('calls the onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      onClick: handleClick 
    });
    
    const button = container.querySelector('button');
    await fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    
    // Re-render with click handler and disabled state
    const { container } = safeRender(Button, { 
      label: 'Click me', 
      onClick: handleClick,
      disabled: true
    });
    
    const button = container.querySelector('button');
    await fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
