<script lang="ts">
  export let title = "Sunburst Chart";
  export let height = "300px";
  
  let container: HTMLDivElement;
  
  // Simple mock rendering function that just creates a colored circle
  function renderMockChart() {
    if (container) {
      container.innerHTML = `
        <div style="position: relative; width: 100%; height: ${height};">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
            <div style="font-size: 14px; color: var(--text-primary);">${title}</div>
          </div>
          <svg width="100%" height="100%" viewBox="0 0 200 200">
            <!-- Outer ring -->
            <circle cx="100" cy="100" r="80" fill="var(--color-primary-alpha)" />
            
            <!-- Middle ring -->
            <circle cx="100" cy="100" r="60" fill="var(--color-primary-light)" />
            
            <!-- Inner ring -->
            <circle cx="100" cy="100" r="40" fill="var(--color-primary)" />
            
            <!-- Center -->
            <circle cx="100" cy="100" r="20" fill="var(--color-primary-dark)" />
          </svg>
        </div>
      `;
    }
  }
  
  // Call render when the component is mounted
  import { onMount } from 'svelte';
  
  onMount(() => {
    renderMockChart();
  });
</script>

<div class="sunburst-container" bind:this={container} style="height: {height};"></div>

<style>
  .sunburst-container {
    width: 100%;
    position: relative;
    background-color: var(--bg-container);
    border-radius: var(--radius-card);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
  }
</style>
