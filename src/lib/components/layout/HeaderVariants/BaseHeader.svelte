<script lang="ts">
    export let title: string;
    export let subtitle: string = '';
    export let headerSlot = false;
</script>

<header class="base-header">
    <div class="header-content">
        <h1 class="text-2xl font-bold text-rose-900">{title}</h1>
        {#if subtitle}
            <p class="text-rose-700 mt-1">{subtitle}</p>
        {/if}
    </div>
    {#if headerSlot}
        <slot name="header" />
    {/if}
</header>

<style>
    .base-header {
        padding: var(--spacing-header);
        background: transparent;
        z-index: var(--z-header);
    }

    .header-content {
        text-align: center;
        max-width: 20rem;
        margin: 0 auto;
    }
</style>
