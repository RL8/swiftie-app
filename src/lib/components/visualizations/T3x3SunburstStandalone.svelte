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
  let testContainer = $state<HTMLDivElement | null>(null);
  let userSelectedAlbums = $state<Album[]>([]);
  let userSelectedSongs = $state<Map<string, string[]>>(new Map());
  
  // Generate some test data for the test chart
  const testData = {
    name: 'Test Chart Root',
    children: [
      {
        name: 'Category A',
        value: 225,
        children: [
          { name: 'Item 1', value: 100 },
          { name: 'Item 2', value: 75 },
          { name: 'Item 3', value: 50 },
        ]
      },
      {
        name: 'Category B',
        value: 140,
        children: [
          { name: 'Item 4', value: 80 },
          { name: 'Item 5', value: 60 },
        ]
      }
    ]
  };
  
  // Function to generate demo T3x3 data
  function generateDemoT3x3Data() {
    console.log('T3x3SunburstStandalone: Generating demo data');
    
    // Create a simple demo hierarchy for testing
    const demoData: T3x3Node = {
      name: "Taylor Swift T3×3",
      children: [
        {
          name: "Red TV",
          children: [
            { name: "All Too Well", value: 100 },
            { name: "The Last Time", value: 80 },
            { name: "Begin Again", value: 90 }
          ]
        },
        {
          name: "reputation",
          children: [
            { name: "...Ready For It?", value: 95 },
            { name: "New Year's Day", value: 85 },
            { name: "Dancing With Our Hands Tied", value: 90 }
          ]
        },
        {
          name: "Lover",
          children: [
            { name: "ME!", value: 80 },
            { name: "I Think He Knows", value: 90 },
            { name: "I Forgot That You Existed", value: 85 }
          ]
        }
      ]
    };
    
    console.log('T3x3SunburstStandalone: Demo data generated', demoData);
    return demoData;
  }
  
  // Function to generate data based on user's actual selections
  function generateDataFromUserSelections() {
    console.log('T3x3SunburstStandalone: Generating data from user selections', {
      userSelectedAlbums,
      userSelectedSongs
    });
    
    // If we don't have user selections, use demo data
    if (!userSelectedAlbums || userSelectedAlbums.length === 0) {
      console.log('T3x3SunburstStandalone: No user selections found, using demo data');
      return generateDemoT3x3Data();
    }
    
    // Create T3x3 categories from the user's selected albums and songs
    const t3x3Categories: T3x3Category[] = [];
    
    // Use up to 3 albums
    const topAlbums = userSelectedAlbums.slice(0, 3);
    
    // Process each selected album
    topAlbums.forEach((album: Album) => {
      // Get the selected songs for this album
      const songsList = userSelectedSongs.get(album.id) || [];
      console.log(`T3x3SunburstStandalone: Processing album ${album.title} with songs:`, songsList);
      
      // Create category with top 3 songs
      const category: T3x3Category = {
        name: album.title,
        items: songsList.slice(0, 3).map((songName: string, index: number) => ({
          name: songName,
          // Assign higher value to higher ranked songs
          value: 100 - (index * 20)
        }))
      };
      
      t3x3Categories.push(category);
    });
    
    // If we don't have enough data, fall back to demo data
    if (t3x3Categories.length === 0 || t3x3Categories.some(c => c.items.length === 0)) {
      console.log('T3x3SunburstStandalone: Insufficient user data, falling back to demo');
      return generateDemoT3x3Data();
    }
    
    // Generate the sunburst data from the categories
    console.log('T3x3SunburstStandalone: Generating sunburst data from categories', t3x3Categories);
    const result = generateT3x3SunburstData(t3x3Categories, "My T3×3");
    console.log('T3x3SunburstStandalone: Final data', result);
    return result;
  }
  
  // Create test chart
  $effect(() => {
    console.log('T3x3SunburstStandalone: Creating test chart');
    if (!testContainer) {
      console.log('T3x3SunburstStandalone: Test container is null');
      return;
    }
    
    // Clear any existing chart
    testContainer.innerHTML = '';
    
    try {
      // NOTE: Similar to the main chart, there may be console errors here that
      // don't affect functionality. These are related to library initialization
      // in Svelte 5's runes mode and can be addressed in future optimization.
      console.log('T3x3SunburstStandalone: Initializing test Sunburst instance');
      try {
        const testChart = new Sunburst(testContainer);
        console.log('T3x3SunburstStandalone: Sunburst constructor successful');
        
        testChart
          .data(testData)
          .width(testContainer.clientWidth)
          .height(200)
          .label('name')
          .size('value')
          .centerLabel('Test')
          .color(() => '#1DB954');
            
        console.log('T3x3SunburstStandalone: Test chart rendered');
      } catch (sunburstError) {
        console.error('T3x3SunburstStandalone: Error in Sunburst constructor or method chain', sunburstError);
      }
    } catch (error) {
      console.error('T3x3SunburstStandalone: Error creating test chart', error);
    }
  });
  
  // Function to set the user data from external sources
  function setUserData(albums: Album[], songs: Map<string, string[]>) {
    console.log('T3x3SunburstStandalone: Setting user data', { albums, songs });
    userSelectedAlbums = albums;
    userSelectedSongs = songs;
    
    // Generate new data when user data is updated
    data = generateDataFromUserSelections();
    
    // Re-create the chart with the new data
    createChart();
  }
  
  // Function to update the chart when the data changes
  $effect(() => {
    console.log('T3x3SunburstStandalone: Data effect triggered, data changed:', data);
    if (data && container) {
      createChart();
    }
  });
  
  // Initialize data on mount
  $effect(() => {
    console.log('T3x3SunburstStandalone: Component mounted, initializing data');
    // Generate data immediately so it's available
    if (!data) {
      console.log('T3x3SunburstStandalone: No data exists yet, generating it now');
      data = generateDemoT3x3Data();
      console.log('T3x3SunburstStandalone: Initial data generated:', data);
    }
  });
  
  // Function to create and render the sunburst chart
  function createChart() {
    console.log('T3x3SunburstStandalone: Creating chart', { 
      container: container ? {
        exists: true,
        width: container.clientWidth,
        height: container.clientHeight
      } : 'null',
      dataExists: !!data
    });
    
    if (!container || !data) {
      console.warn('T3x3SunburstStandalone: Cannot create chart - container or data is null');
      return;
    }
    
    // Clear any existing chart
    container.innerHTML = '';
    
    // NOTE: There are known console errors related to the Sunburst library initialization
    // that don't affect functionality. These are likely related to Svelte 5 runes mode
    // integration with third-party libraries and can be addressed in future optimization.
    try {
      // Create the sunburst chart instance with the proper 'new' keyword
      console.log('T3x3SunburstStandalone: Initializing Sunburst instance');
      try {
        chartInstance = new Sunburst(container);
        console.log('T3x3SunburstStandalone: Sunburst constructor successful');
        
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
          .tooltipContent((d: any) => d.value ? `Popularity: ${d.value}` : '');
        
        // Add onClick handler separately to avoid TypeScript errors
        chartInstance.onClick((node: any) => {
          // Zoom handling is built into the library
        });
        
        console.log('T3x3SunburstStandalone: Chart rendered successfully');
      } catch (sunburstError) {
        console.error('T3x3SunburstStandalone: Error in Sunburst constructor or method chain', sunburstError);
      }
    } catch (error) {
      console.error('T3x3SunburstStandalone: Error creating chart', error);
    }
  }
  
  // Watch for container changes
  $effect(() => {
    console.log('T3x3SunburstStandalone: Container effect triggered', { containerExists: !!container });
    if (container && data) {
      // Add slight delay to ensure container dimensions are calculated
      setTimeout(() => {
        createChart();
      }, 10);
    }
  });
  
  // Handle window resize
  function handleResize() {
    if (container && chartInstance) {
      chartInstance.width(container.clientWidth);
    }
  }
  
  // Add resize listener
  $effect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="t3x3-container">
  <h2 class="chart-title">{title}</h2>
  
  <!-- Test chart to verify library works -->
  <div class="test-section">
    <h3>Test Chart</h3>
    <p>This is a simple test chart to verify the sunburst library is working correctly.</p>
    <div bind:this={testContainer} class="test-container"></div>
  </div>
  
  <div bind:this={container} class="chart-container" style="width: {width}; height: {height};"></div>
  
  <!-- Debug section - will be removed after fixing the issue -->
  <div class="debug-section">
    <h3>Debug Data</h3>
    <p>Container exists: {!!container}</p>
    <p>Test Container exists: {!!testContainer}</p>
    <p>Container dimensions: {container ? `${container.clientWidth}x${container.clientHeight}` : 'N/A'}</p>
    <p>Test Container dimensions: {testContainer ? `${testContainer.clientWidth}x${testContainer.clientHeight}` : 'N/A'}</p>
    <p>Data exists: {!!data}</p>
    <p>Chart instance exists: {!!chartInstance}</p>
    <p>Svelte version: 5</p>
    {#if data}
      <p>Root node: {data.name}</p>
      <p>Children count: {data.children?.length || 0}</p>
      {#if data.children && data.children.length > 0}
        <div class="debug-children">
          <h4>First-level children:</h4>
          <ul>
            {#each data.children as child}
              <li>
                {child.name} ({child.value}) - Sub-items: {child.children?.length || 0}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .t3x3-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .chart-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    font-weight: bold;
    color: #1DB954; /* Spotify green */
  }
  
  .chart-container {
    margin: 20px auto;
    position: relative;
    /* Border to see container dimensions better */
    border: 2px dashed #ccc;
  }
  
  .test-section {
    margin: 20px 0;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    border: 1px solid #eee;
  }
  
  .test-container {
    height: 200px;
    width: 100%;
    /* Border to see container dimensions better */
    border: 2px dashed #ffcccc;
  }
  
  .debug-section {
    margin-top: 30px;
    padding: 20px;
    background-color: #f0f8ff;
    border-radius: 10px;
    border: 1px solid #d0e0f0;
    font-family: monospace;
    font-size: 14px;
  }
  
  .debug-section h3 {
    color: #0066cc;
    margin-top: 0;
  }
  
  .debug-section p {
    margin: 5px 0;
  }
  
  .debug-children {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
  .debug-children ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .debug-children li {
    margin: 5px 0;
  }
</style>
