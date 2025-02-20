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
        padding: 0.75rem 1.5rem;
        border-radius: 9999px;
        font-weight: 600;
        transition: transform 0.15s ease-out;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .btn:active:not(.btn-disabled) {
        transform: translateY(1px);
    }

    .btn-primary {
        background-color: rgb(244, 63, 94);
        color: white;
    }

    .btn-primary:active:not(.btn-disabled) {
        background-color: rgb(225, 29, 72);
    }

    .btn-secondary {
        background-color: rgb(226, 232, 240);
        color: rgb(15, 23, 42);
    }

    .btn-secondary:active:not(.btn-disabled) {
        background-color: rgb(203, 213, 225);
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
