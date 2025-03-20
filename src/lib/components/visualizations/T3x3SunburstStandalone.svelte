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
  import { getContext } from 'svelte';
  import type { MusicContext } from '$lib/context/music.svelte.ts';
  
  // Get music context
  const music = getContext<() => MusicContext>('music')();
  
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
  
  // Generate data from music context
  $effect(() => {
    // Convert music context data to T3x3 format
    const categories: T3x3Category[] = [];
    
    // Only proceed if we have selected albums
    if (music.selectedAlbums.length > 0) {
      // Process each album as a category
      music.selectedAlbums.forEach(album => {
        const songs = music.selectedSongsByAlbum.get(album.id) || [];
        
        // Create items for this category (songs)
        const items = songs.map(songTitle => ({
          name: songTitle,
          value: 100 // Equal weight for now
        }));
        
        // Add this album as a category with its color
        categories.push({
          name: album.title,
          items: items,
          color: album.color // Store the album color directly
        });
      });
      
      // Generate the sunburst data
      data = generateT3x3SunburstData(categories, title);
    }
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
        .tooltipTitle((d: any) => d.name)
        .tooltipContent((d: any) => d.value ? `Popularity: ${d.value}` : '')
        .color((d: any) => {
          // If the node has a color property, use it directly
          if (d.color) {
            return d.color;
          }
          
          // Different color schemes for different levels as fallback
          const colors = [
            '#FF69B4', // Hot Pink (Root)
            '#1DB954', // Spotify Green (Albums)
            '#9B59B6', // Purple (Songs)
          ];
          return colors[d.depth] || colors[0];
        });
      
      // Try to set center label separately if supported
      try {
        // @ts-ignore - Attempt to set center label
        if (typeof chartInstance.centerLabel === 'function') {
          chartInstance.centerLabel(centerLabel);
        }
      } catch (labelError) {
        // Silently ignore if centerLabel is not supported
      }
      
    } catch (error) {
      console.error('Error creating chart', error);
    }
  }
  
  // Watch for container changes and data updates
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
    min-height: 600px;
    position: relative;
    margin: 0 auto;
  }
</style>
