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
    centerLabel = 'T3×3',
    userSelectedAlbums = [],
    userSelectedSongs = new Map()
  } = $props<{
    title?: string;
    width?: string;
    height?: string;
    centerLabel?: string;
    userSelectedAlbums?: Album[];
    userSelectedSongs?: Map<string, string[]>;
  }>();
  
  // State variables with proper typing
  let data = $state<ReturnType<typeof generateT3x3SunburstData> | null>(null);
  let chartInstance = $state<any | null>(null);
  let container = $state<HTMLDivElement | null>(null);

  // Function to generate data based on user's actual selections
  function generateDataFromUserSelections() {
    // If we don't have sufficient user selections, return null
    if (!userSelectedAlbums || userSelectedAlbums.length === 0) {
      return null;
    }
    
    // Create T3x3 categories from the user's selected albums and songs
    const t3x3Categories: T3x3Category[] = [];
    
    // Use up to 3 albums
    const topAlbums = userSelectedAlbums.slice(0, 3);
    
    // Process each selected album
    topAlbums.forEach((album: Album) => {
      // Get the selected songs for this album
      const songsList = userSelectedSongs.get(album.id) || [];
      
      // Create category with top 3 songs
      const category: T3x3Category = {
        name: album.title,
        items: songsList.slice(0, 3).map((songName: string, index: number) => ({
          name: songName,
          value: 100 - index * 10 // Give higher values to higher-ranked songs
        }))
      };
      
      // Only add categories that have at least one song
      if (category.items.length > 0) {
        t3x3Categories.push(category);
      }
    });
    
    // Only generate data if we have at least one category with items
    if (t3x3Categories.length === 0) {
      return null;
    }

    // Generate and return the sunburst data structure
    return generateT3x3SunburstData(t3x3Categories, centerLabel);
  }
  
  function createChart() {
    if (!container) return;
    
    // Generate the data from user selections
    data = generateDataFromUserSelections();
    
    // If we have data and a container, create the chart
    if (data && container) {
      // Clear any existing chart
      if (chartInstance) {
        chartInstance = null;
        container.innerHTML = '';
      }
      
      // Create a new chart
      chartInstance = Sunburst()
        .data(data)
        .width(container.clientWidth)
        .height(container.clientHeight)
        .label('name')
        .size('value')
        .color((d: any, parent: any) => {
          // Use album colors for top-level segments
          if (parent === data) {
            // Find the album by name
            const album = albums.find(a => a.title === d.name);
            return album ? album.color : '#cccccc';
          }
          
          // Otherwise, use a lighter version of the parent color
          return parent && parent !== data 
            ? d3.color(parent.color)?.brighter(0.5).toString() || '#dddddd'
            : '#eeeeee';
        })
        .radiusScaleExponent(0.6) // Adjust to make inner rings more visible
        .centerRadius(0.3) // Create an empty space in the center
        .showLabels(true)
        .tooltipContent((d: any) => `<div>${d.name}</div><div>${d.value} points</div>`)
        .tooltipTitle('')
        .onClick((node: any) => {
          // Optional click behavior
        })(container);
        
      // Add center label if specified
      if (centerLabel) {
        const centerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
        // Add the text with styles
        centerText.textContent = centerLabel;
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('dominant-baseline', 'middle');
        centerText.setAttribute('font-size', '14px');
        centerText.setAttribute('font-weight', 'bold');
        centerText.setAttribute('fill', '#333');
        
        centerGroup.appendChild(centerText);
        
        // Find the main SVG and add our center label
        const svg = container.querySelector('svg');
        if (svg) {
          svg.appendChild(centerGroup);
          
          // Position in center
          const svgWidth = parseInt(svg.getAttribute('width') || '0');
          const svgHeight = parseInt(svg.getAttribute('height') || '0');
          
          centerText.setAttribute('x', (svgWidth / 2).toString());
          centerText.setAttribute('y', (svgHeight / 2).toString());
        }
      }
    }
  }

  // Set up the chart when the component mounts
  $effect(() => {
    if (container) {
      createChart();
    }
  });
  
  // Update the chart when data changes or container resizes
  $effect(() => {
    if (userSelectedAlbums && userSelectedSongs) {
      createChart();
    }
  });
</script>

<div class="t3x3-container">
  <h2 class="chart-title">{title}</h2>
  
  <div 
    class="chart-container" 
    style="width: {width}; height: {height};" 
    bind:this={container}
  >
    {#if !data}
      <div class="no-data-message">
        <p>Select 3 albums and at least 3 songs per album to generate your visualization</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .t3x3-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
  }
  
  .chart-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .chart-container {
    position: relative;
    margin: 0 auto;
  }
  
  .no-data-message {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    color: #666;
    font-size: 1rem;
  }
</style>
