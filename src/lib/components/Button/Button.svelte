<script lang="ts">
    import { tap } from '@sveltejs/gestures';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    interface Props {
        variant?: ButtonProps['variant'];
        size?: ButtonProps['size'];
        disabled?: ButtonProps['disabled'];
        fullWidth?: ButtonProps['fullWidth'];
        type?: ButtonProps['type'];
        children?: import('svelte').Snippet;
        [key: string]: any
    }

    let {
        variant = 'primary',
        size = 'default',
        disabled = false,
        fullWidth = false,
        type = 'button',
        children,
        ...rest
    }: Props = $props();

    function handleTap(event: CustomEvent) {
        if (!disabled) {
            dispatch('click', event.detail);
        }
    }

    function handleTouchStart() {
        if (navigator.vibrate && !disabled) {
            navigator.vibrate(50);
        }
    }
</script>

<button
    {type}
    {disabled}
    class="btn btn-{variant} {fullWidth ? 'btn-full' : ''} {size === 'compact' ? 'btn-compact' : ''}"
    class:btn-disabled={disabled}
    use:tap
    ontap={handleTap}
    ontouchstart={handleTouchStart}
    {...rest}
>
    {@render children?.()}
</button>

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-3) var(--space-6);
        border-radius: var(--radius-button);
        font-weight: 600;
        transition: transform var(--duration-fast) var(--timing-function);
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .btn:active:not(.btn-disabled) {
        transform: translateY(1px);
    }

    .btn-primary {
        background-color: var(--color-primary);
        color: var(--text-on-primary);
    }

    .btn-primary:active:not(.btn-disabled) {
        background-color: var(--color-primary-dark);
    }

    .btn-secondary {
        background-color: var(--color-secondary);
        color: var(--text-on-secondary);
        border: 1px solid var(--color-secondary-dark);
    }

    .btn-secondary:active:not(.btn-disabled) {
        background-color: var(--color-secondary-dark);
    }

    .btn-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-full {
        width: 100%;
    }

    .btn-compact {
        padding: var(--space-2);
        font-size: var(--text-sm);
        min-width: unset;
        opacity: 0.9;
    }
</style>
