<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../lib/components/demo/Button.svelte';

  const { Story } = defineMeta({
    title: 'Demo/Simple Button',
    component: Button
  });
</script>

<Story name="Primary" args={{ primary: true, label: 'Primary Button' }} />
