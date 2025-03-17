<script lang="ts">
    import type { FooterProps } from '$lib/types/components';
    
    interface Props {
        variant?: FooterProps['variant'];
        hasBorder?: FooterProps['hasBorder'];
        children?: import('svelte').Snippet;
    }

    let { variant = 'base', hasBorder = true, children }: Props = $props();
</script>

<footer class="footer" class:with-border={hasBorder}>
    <div class="footer-content" class:footer-button={variant === 'button'}>
        {@render children?.()}
    </div>
</footer>

<style>
    .footer {
        padding: var(--spacing-footer);
        background: var(--bg-header);
        backdrop-filter: var(--blur-sm);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: var(--footer-height);
    }

    .with-border {
        border-top: 1px solid var(--color-primary-alpha);
    }

    .footer-content {
        width: 100%;
        max-width: var(--container-max-width);
        display: flex;
        justify-content: center;
        gap: var(--space-3);
    }

    .footer-button {
        padding: 0 var(--spacing-footer);
    }

    .footer-button :global(button) {
        height: calc(var(--footer-height) - (2 * var(--spacing-footer)));
        min-height: unset;
        min-width: 12rem;
    }
</style>
