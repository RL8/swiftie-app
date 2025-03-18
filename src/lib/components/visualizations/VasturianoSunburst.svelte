<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sunburst from 'sunburst-chart';

  // Define types
  type SunburstNode = {
    name: string;
    value?: number;
    children?: SunburstNode[];
    [key: string]: any;
  };

  // Props
  export let data: SunburstNode = {
    name: "root",
    children: [
      {
        name: "leafA",
        value: 3
      },
      {
        name: "nodeB",
        children: [
          {
            name: "leafBA",
            value: 5
          },
          {
            name: "leafBB",
            value: 1
          }
        ]
      }
    ]
  };
  export let width: string = '100%';
  export let height: string = '500px';
  export let colorField: string | null = null;
  export let valueField: string = 'value';
  export let labelField: string = 'name';
  export let tooltipContent: ((d: any, node: any) => string) | null = null;
  export let onClick: ((node: any) => void) | null = null;
  export let transitionDuration: number = 750;
  export let excludeRoot: boolean = true;
  export let centerText: string = "";

  // Local variables
  let container: HTMLDivElement;
  let chart: any;

  // Initialize and render the chart
  function renderChart(): void {
    if (!container || typeof window === 'undefined') return;

    // Clear previous chart if it exists
    container.innerHTML = '';

    // Create new chart instance
    // @ts-ignore - Sunburst is a function that returns a chart instance
    chart = Sunburst(container)
      .data(data)
      .size(valueField)
      .label(labelField)
      .excludeRoot(excludeRoot)
      .centerRadius(0.1)
      .transitionDuration(transitionDuration);

    // Apply color function if provided
    if (colorField) {
      chart.color((d: any) => d[colorField]);
    }

    // Apply tooltip content if provided
    if (tooltipContent) {
      chart.tooltipContent(tooltipContent);
    } else {
      chart.tooltipContent((d: any, node: any) => `${node.data[labelField]}: ${node.value}`);
    }

    // Apply click handler if provided
    if (onClick) {
      chart.onClick(onClick);
    } else {
      // Default behavior: focus on clicked node
      chart.onClick(chart.focusOnNode);
    }

    // Update center text if provided
    if (centerText) {
      const textElement = container.querySelector('.sunburst-center-text');
      if (textElement) {
        textElement.textContent = centerText;
      }
    }
  }

  // Lifecycle hooks
  onMount(() => {
    renderChart();
  });

  onDestroy(() => {
    // Clean up
    if (container) {
      container.innerHTML = '';
    }
  });

  // Re-render when data changes
  $: if (container && data && typeof window !== 'undefined') {
    renderChart();
  }
</script>

<div class="vasturiano-sunburst-container" bind:this={container} style="width: {width}; height: {height};">
  <!-- Chart will be rendered here -->
</div>

<style>
  .vasturiano-sunburst-container {
    position: relative;
    background-color: var(--bg-container, white);
    border-radius: var(--radius-card, 8px);
    padding: var(--space-4, 1rem);
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
    margin: var(--space-4, 1rem) 0;
  }

  :global(.sunburst-tooltip) {
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
  }
</style>
