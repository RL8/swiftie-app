<script lang="ts">
    import BaseButton from './BaseButton.svelte';
    
    export let type = 'button';
    export let disabled = false;
    export let fullWidth = false;
    export let className = 'secondary-button';
</script>

<BaseButton 
    {type}
    {disabled}
    {fullWidth}
    class={className}
    on:click
    on:touchstart
>
    <slot></slot>
</BaseButton>

<style>
</style>
