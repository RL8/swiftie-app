<script lang="ts">
    import type { ButtonProps } from '$lib/types/components';
    
    export let variant: ButtonProps['variant'] = 'primary';
    export let size: ButtonProps['size'] = 'default';
    export let disabled: ButtonProps['disabled'] = false;
    export let fullWidth: ButtonProps['fullWidth'] = false;
    export let type: ButtonProps['type'] = 'button';

    function handleTouchStart() {
        if (navigator.vibrate && !disabled) {
            navigator.vibrate(50);
        }
    }
</script>

<button
    {type}
    {disabled}
    class="btn"
    class:btn-primary={variant === 'primary'}
    class:btn-secondary={variant === 'secondary'}
    class:btn-compact={size === 'compact'}
    class:btn-full={fullWidth}
    class:btn-disabled={disabled}
    on:click
    on:touchstart={handleTouchStart}
    {...$$restProps}
>
    <slot />
</button>

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        font-size: 1rem;
        border: none;
    }

    .btn-primary {
        background: #E31C58;
        color: white;
    }

    .btn-primary:hover:not(.btn-disabled) {
        background: #C01145;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: transparent;
        color: #E31C58;
        border: 2px solid #E31C58;
    }

    .btn-secondary:hover:not(.btn-disabled) {
        background: rgba(227, 28, 88, 0.1);
    }

    .btn-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-full {
        width: 100%;
    }

    .btn-compact {
        padding: 0.5rem;
        font-size: 0.875rem;
        min-width: unset;
        opacity: 0.9;
    }
</style>
