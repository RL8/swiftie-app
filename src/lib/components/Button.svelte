<script lang="ts">
    export let variant: 'primary' | 'secondary' = 'primary';
    export let shimmer = false;
    export let type = 'button';
    
    function vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
</script>

<button
    {type}
    class={`button-${variant} ${shimmer ? 'subtle-shimmer' : ''}`}
    on:click
    on:touchstart={vibrate}
>
    <slot />
</button>
