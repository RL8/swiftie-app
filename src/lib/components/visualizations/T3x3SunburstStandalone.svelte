<script lang="ts">
  /**
   * T3x3SunburstStandalone Component - v1.0.0
   * Displays a sunburst visualization of T3x3 data
   * Interactive visualization of Taylor Swift albums and songs
   */
  import Sunburst from 'sunburst-chart';
  import { generateT3x3SunburstData, type T3x3Category } from '$lib/utils/t3x3DataGenerator';
  import { albums } from '$lib/data/albums';
  import type { Album } from '$lib/types/album';
  
  // Props with default values using Svelte 5 syntax
  const { 
    title = 'My Top 3×3',
    width = '100%', 
    height = '500px',
    centerLabel = 'T3×3'
  } = $props();
  
  // State variables with proper typing
  let data = $state<ReturnType<typeof generateT3x3SunburstData> | null>(null);
  let chartInstance = $state<any | null>(null);
  let container = $state<HTMLDivElement | null>(null);
  let userSelectedAlbums = $state<Album[]>([]);
  let userSelectedSongs = $state<Map<string, string[]>>(new Map());
  
  // Generate some test data for the test chart
  const testData = {
    name: 'Taylor Swift T3×3',
    children: [
      {
        name: 'Red TV',
        value: 300,
        children: [
          { name: 'All Too Well (10 Minute Version)', value: 100 },
          { name: 'State of Grace', value: 100 },
          { name: 'Red', value: 100 },
        ]
      },
      {
        name: 'Folklore',
        value: 300,
        children: [
          { name: 'Cardigan', value: 100 },
          { name: 'August', value: 100 },
          { name: 'The Last Great American Dynasty', value: 100 },
        ]
      },
      {
        name: 'Lover',
        value: 300,
        children: [
          { name: 'Cruel Summer', value: 100 },
          { name: 'Lover', value: 100 },
          { name: 'Daylight', value: 100 },
        ]
      }
    ]
  };
  
  // Initialize with test data
  $effect(() => {
    data = testData;
  });
  
  // Function to create and render the sunburst chart
  function createChart() {
    if (!container || !data) {
      return;
    }
    
    // Clear any existing chart
    container.innerHTML = '';
    
    try {
      // Create the sunburst chart instance
      chartInstance = new Sunburst(container);
      
      chartInstance
        .data(data)
        .width(container.clientWidth)
        .height(parseInt(height))
        .label('name')
        .size('value')
        .color((d: any, parent: any) => {
          // Get album colors from the app's data for the first level
          if (d.depth === 1 && userSelectedAlbums.length > 0) {
            // Try to find the album in user's selections
            const album = userSelectedAlbums.find((a: Album) => a.title === d.name);
            if (album) return album.color;
            
            // Try to find in all albums if not in user selections
            const allAlbum = albums.find(a => a.title === d.name);
            if (allAlbum) return allAlbum.color;
          }
          
          // Different color schemes for different levels as fallback
          const colors = [
            '#FF69B4', // Hot Pink (Root)
            '#1DB954', // Spotify Green (Albums)
            '#9B59B6', // Purple (Songs)
          ];
          return colors[d.depth] || colors[0];
        })
        .centerLabel(centerLabel)
        .tooltipTitle((d: any) => d.name)
        .tooltipContent((d: any) => d.value ? `Popularity: ${d.value}` : '')
        .transitionDuration(0); // Disable animations to prevent errors
      
    } catch (error) {
      console.error('Error creating chart', error);
    }
  }
  
  // Watch for container changes
  $effect(() => {
    if (container && data) {
      // Add slight delay to ensure container dimensions are calculated
      setTimeout(() => {
        createChart();
      }, 10);
    }
  });
  
  // Clean up on destroy
  $effect(() => {
    return () => {
      if (chartInstance) {
        // Clean up chart instance if needed
        container = null;
        chartInstance = null;
      }
    };
  });
</script>

<div class="chart-container" bind:this={container} style="width: {width}; height: {height};"></div>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
    position: relative;
  }
</style>
