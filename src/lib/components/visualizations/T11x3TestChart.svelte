<script lang="ts">
  // T11x3TestChart.svelte - A test component for the T11x3 Sunburst visualization
  // This is a simplified test chart with hardcoded data to verify the sunburst library
  // can handle a larger dataset structure (11 albums × 3 songs)
  
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { Sunburst } from 'sunburst-chart';
  
  export let title = "T11×3 Test Chart";
  export let centerLabel = "T11×3 Test";
  export let height = "500px";
  export let width = "100%";
  
  let chartContainer: HTMLElement;
  let chart: any;
  
  // Generate test data with 11 categories (albums) and 3 items (songs) each
  function generateTestData() {
    return {
      name: centerLabel,
      children: [
        {
          name: "Album 1",
          children: [
            { name: "Song 1-1", value: 1 },
            { name: "Song 1-2", value: 1 },
            { name: "Song 1-3", value: 1 }
          ]
        },
        {
          name: "Album 2",
          children: [
            { name: "Song 2-1", value: 1 },
            { name: "Song 2-2", value: 1 },
            { name: "Song 2-3", value: 1 }
          ]
        },
        {
          name: "Album 3",
          children: [
            { name: "Song 3-1", value: 1 },
            { name: "Song 3-2", value: 1 },
            { name: "Song 3-3", value: 1 }
          ]
        },
        {
          name: "Album 4",
          children: [
            { name: "Song 4-1", value: 1 },
            { name: "Song 4-2", value: 1 },
            { name: "Song 4-3", value: 1 }
          ]
        },
        {
          name: "Album 5",
          children: [
            { name: "Song 5-1", value: 1 },
            { name: "Song 5-2", value: 1 },
            { name: "Song 5-3", value: 1 }
          ]
        },
        {
          name: "Album 6",
          children: [
            { name: "Song 6-1", value: 1 },
            { name: "Song 6-2", value: 1 },
            { name: "Song 6-3", value: 1 }
          ]
        },
        {
          name: "Album 7",
          children: [
            { name: "Song 7-1", value: 1 },
            { name: "Song 7-2", value: 1 },
            { name: "Song 7-3", value: 1 }
          ]
        },
        {
          name: "Album 8",
          children: [
            { name: "Song 8-1", value: 1 },
            { name: "Song 8-2", value: 1 },
            { name: "Song 8-3", value: 1 }
          ]
        },
        {
          name: "Album 9",
          children: [
            { name: "Song 9-1", value: 1 },
            { name: "Song 9-2", value: 1 },
            { name: "Song 9-3", value: 1 }
          ]
        },
        {
          name: "Album 10",
          children: [
            { name: "Song 10-1", value: 1 },
            { name: "Song 10-2", value: 1 },
            { name: "Song 10-3", value: 1 }
          ]
        },
        {
          name: "Album 11",
          children: [
            { name: "Song 11-1", value: 1 },
            { name: "Song 11-2", value: 1 },
            { name: "Song 11-3", value: 1 }
          ]
        }
      ]
    };
  }

  onMount(() => {
    try {
      console.log('Initializing T11x3 test chart');
      
      // Generate test data
      const data = generateTestData();
      console.log('T11x3 test data:', data);
      
      // Initialize the chart
      chart = Sunburst()
        .data(data)
        .size('value')
        .color((d, parent) => {
          // Use different colors for different levels
          return !parent ? '#eee' : // root
            d.children ? d3.schemeCategory10[d.name.charCodeAt(0) % 10] : // albums
            d3.color(d3.schemeCategory10[d.parent.name.charCodeAt(0) % 10])?.brighter(0.5); // songs
        })
        .label(d => d.name)
        .centerLabel(centerLabel)
        .tooltipContent((d, node) => `${node.name}`)
        .tooltipTitle((d, node) => node.parent ? `${node.parent.name}` : '')
        .width(chartContainer.clientWidth)
        .height(parseInt(height))
        (chartContainer);
      
      console.log('T11x3 test chart initialized successfully');
    } catch (error) {
      console.error('Error initializing T11x3 test chart:', error);
    }
  });
</script>

<div class="chart-wrapper">
  <h3 class="chart-title">{title}</h3>
  <div class="chart-container" bind:this={chartContainer} style="height: {height}; width: {width};"></div>
</div>

<style>
  .chart-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .chart-title {
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .chart-container {
    width: 100%;
    position: relative;
  }
  
  :global(.chart-container svg) {
    max-width: 100%;
  }
  
  :global(.sunburst-viz text) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
  }
  
  :global(.sunburst-viz .slice-label) {
    fill: #fff;
    pointer-events: none;
  }
  
  :global(.sunburst-viz .main-arc) {
    stroke: #fff;
    stroke-width: 1px;
  }
  
  :global(.sunburst-tooltip) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
    padding: 5px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>
