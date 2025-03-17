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
            <div style="font-size: 14px; color: #555;">${title}</div>
          </div>
          <svg width="100%" height="100%" viewBox="0 0 200 200">
            <!-- Outer ring -->
            <circle cx="100" cy="100" r="80" fill="#E8C1E1" />
            
            <!-- Middle ring -->
            <circle cx="100" cy="100" r="60" fill="#8CD1E6" />
            
            <!-- Inner ring -->
            <circle cx="100" cy="100" r="40" fill="#B02428" />
            
            <!-- Center -->
            <circle cx="100" cy="100" r="20" fill="#ACA9A0" />
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
  }
</style>
