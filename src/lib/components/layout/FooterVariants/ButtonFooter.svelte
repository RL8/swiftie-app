<script lang="ts">
    import BaseFooter from './BaseFooter.svelte';
    
    export let hasBorder = true;
</script>

<BaseFooter {hasBorder}>
    <div class="button-container">
        <slot />
    </div>
</BaseFooter>

<style>
    .button-container {
        display: flex;
        gap: var(--spacing-content);
    }
</style>
