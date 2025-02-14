<script lang="ts">
    export let hasBorder = true;
</script>

<footer class="base-footer" class:with-border={hasBorder}>
    <div class="footer-content">
        <slot />
    </div>
</footer>

<style>
    .base-footer {
        width: 100%;
        background: rgb(255 255 255 / 0.6);
        backdrop-filter: blur(8px);
        padding: var(--spacing-footer);
        z-index: var(--z-footer);
    }

    .with-border {
        border-top: 1px solid rgb(254 205 211);
    }

    .footer-content {
        max-width: var(--container-max-width);
        margin: 0 auto;
        padding: 0 var(--spacing-content);
    }
</style>
