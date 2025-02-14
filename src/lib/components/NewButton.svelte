<script>
  import Button from './Button/Button.svelte';
  export let type = 'primary';
  export let shimmer = false;
</script>

<Button {type} variant={type} shimmer={shimmer} {...$$restProps}>
  <slot />
</Button>
