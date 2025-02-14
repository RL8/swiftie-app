<script lang="ts">
    import type { FooterProps } from '$lib/types/components';
    
    export let variant: FooterProps['variant'] = 'base';
    export let hasBorder: FooterProps['hasBorder'] = true;
</script>

<footer class="footer" class:with-border={hasBorder}>
    <div class="footer-content" class:footer-button={variant === 'button'}>
        <slot />
    </div>
</footer>

<style>
    .footer {
        padding: var(--spacing-footer);
        background: var(--bg-header);
        backdrop-filter: var(--blur-sm);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        height: var(--footer-height);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .with-border {
        border-top: 1px solid rgb(254 205 211);
    }

    .footer-content {
        width: 100%;
        max-width: var(--container-max-width);
        display: flex;
        justify-content: center;
        gap: var(--dynamic-spacing-sm);
    }

    .footer-button {
        padding: 0 var(--spacing-footer);
    }

    .footer-button :global(button) {
        height: calc(var(--footer-height) - (2 * var(--spacing-footer)));
        min-height: unset;
    }
</style>
