<script lang="ts">
    export let title: string;
    export let subtitle: string = '';
    export let headerSlot = false;
</script>

<header class="page-header">
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
    .page-header {
        padding: 1.5rem 1rem;
        background: transparent;
    }

    .header-content {
        text-align: center;
        max-width: 20rem;
        margin: 0 auto;
    }
</style>
