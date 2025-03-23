<script>
  // Props
  export let label = '';
  export let variant = 'primary'; // primary, secondary, neutral, danger
  export let size = 'medium'; // small, medium, large
  export let type = 'button';
  export let disabled = false;
  export let fullWidth = false;
  export let onClick = () => {};
  
  // Compute classes based on props
  $: buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
  ].filter(Boolean).join(' ');
</script>

<button
  {type}
  class={buttonClasses}
  {disabled}
  on:click={onClick}
  {...$$restProps}
>
  {label}
  <slot></slot>
</button>

<style>
  .btn {
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Variants */
  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }
  
  .btn-neutral {
    background-color: #e5e7eb;
    color: #1f2937;
  }
  
  .btn-neutral:hover:not(:disabled) {
    background-color: #d1d5db;
  }
  
  .btn-danger {
    background-color: #ef4444;
    color: white;
  }
  
  .btn-danger:hover:not(:disabled) {
    background-color: #dc2626;
  }
  
  /* Sizes */
  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .btn-medium {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  .btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
  
  /* Width */
  .btn-full {
    width: 100%;
  }
</style>
