<script>
  export let label = 'Button';
  export let primary = false;
  export let size = 'medium';
  
  $: mode = primary ? 'primary' : 'secondary';
  $: classes = `button ${mode} ${size}`;
</script>

<button class={classes} on:click>
  {label}
</button>

<style>
  .button {
    font-family: system-ui, -apple-system, sans-serif;
    border-radius: 4px;
    border: 0;
    cursor: pointer;
    display: inline-block;
    line-height: 1;
  }
  
  .primary {
    background-color: #E8C1E1;
    color: white;
  }
  
  .secondary {
    background-color: transparent;
    color: #333;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
  }
  
  .small {
    font-size: 12px;
    padding: 8px 16px;
  }
  
  .medium {
    font-size: 14px;
    padding: 10px 20px;
  }
  
  .large {
    font-size: 16px;
    padding: 12px 24px;
  }
</style>
