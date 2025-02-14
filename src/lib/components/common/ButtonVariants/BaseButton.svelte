<script lang="ts">
    export let type = 'button';
    export let disabled = false;
    export let fullWidth = false;
    
    function handleTouchStart() {
        if (navigator.vibrate && !disabled) {
            navigator.vibrate(50);
        }
    }
</script>

<button
    {type}
    {disabled}
    class="base-button"
    class:full-width={fullWidth}
    on:click
    on:touchstart={handleTouchStart}
>
    <slot></slot>
</button>

<style>
</style>
