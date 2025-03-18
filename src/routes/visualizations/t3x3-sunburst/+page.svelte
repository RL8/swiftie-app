<script lang="ts">
  import T3x3Sunburst from '$lib/components/visualizations/T3x3Sunburst.svelte';
  import { generateSampleT3x3Data, normalizeT3x3Data } from '$lib/utils/t3x3DataGenerator';
  
  // Generate sample data
  const sampleData = generateSampleT3x3Data();
  const normalizedData = normalizeT3x3Data(sampleData);
  
  // Color schemes
  const colorSchemes = {
    default: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    pastel: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'],
    vibrant: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']
  };
  
  let selectedColorScheme = 'default';
  let showLabels = true;
  let showValues = true;
  let transitionDuration = 750;
  let height = '500px';
</script>

<svelte:head>
  <title>T3x3 Sunburst Visualization</title>
</svelte:head>

<div class="t3x3-demo-container">
  <h1>T3x3 Sunburst Visualization</h1>
  
  <div class="controls">
    <div class="control-group">
      <label for="colorScheme">Color Scheme:</label>
      <select id="colorScheme" bind:value={selectedColorScheme}>
        <option value="default">Default</option>
        <option value="pastel">Pastel</option>
        <option value="vibrant">Vibrant</option>
      </select>
    </div>
    
    <div class="control-group">
      <label for="showLabels">Show Labels:</label>
      <input type="checkbox" id="showLabels" bind:checked={showLabels} />
    </div>
    
    <div class="control-group">
      <label for="showValues">Show Values:</label>
      <input type="checkbox" id="showValues" bind:checked={showValues} />
    </div>
    
    <div class="control-group">
      <label for="transitionDuration">Transition Duration:</label>
      <input 
        type="range" 
        id="transitionDuration" 
        bind:value={transitionDuration} 
        min="0" 
        max="2000" 
        step="100" 
      />
      <span>{transitionDuration}ms</span>
    </div>
    
    <div class="control-group">
      <label for="height">Chart Height:</label>
      <select id="height" bind:value={height}>
        <option value="300px">Small (300px)</option>
        <option value="500px">Medium (500px)</option>
        <option value="700px">Large (700px)</option>
      </select>
    </div>
  </div>
  
  <div class="visualization-container">
    <T3x3Sunburst 
      data={normalizedData} 
      title="User T3x3 Visualization" 
      colorScheme={colorSchemes[selectedColorScheme]} 
      {showLabels}
      {showValues}
      {transitionDuration}
      height={height}
      centerText="T3x3"
    />
  </div>
  
  <div class="info-section">
    <h2>About T3x3 Sunburst Visualization</h2>
    <p>
      This interactive sunburst chart visualizes a user's T3x3 preferences. The visualization shows hierarchical data with the following features:
    </p>
    <ul>
      <li><strong>Interactive Zooming:</strong> Click on a segment to zoom in and explore that category in detail.</li>
      <li><strong>Center Button:</strong> Click the center circle to zoom back out.</li>
      <li><strong>Tooltips:</strong> Hover over segments to see detailed information.</li>
      <li><strong>Customizable:</strong> Adjust the appearance using the controls above.</li>
    </ul>
    <p>
      The T3x3 format represents a user's top 3 categories, each containing their top items in that category.
    </p>
  </div>
</div>

<style>
  .t3x3-demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-6);
  }
  
  h1 {
    color: var(--text-primary);
    margin-bottom: var(--space-6);
    text-align: center;
  }
  
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
    padding: var(--space-4);
    background-color: var(--bg-container);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-sm);
  }
  
  .control-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  
  label {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  select, input[type="range"] {
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-input);
    background-color: var(--bg-input);
    color: var(--text-primary);
  }
  
  .visualization-container {
    margin-bottom: var(--space-6);
  }
  
  .info-section {
    padding: var(--space-4);
    background-color: var(--bg-container);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-sm);
  }
  
  h2 {
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
  
  p, ul {
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  ul {
    margin-left: var(--space-4);
    margin-bottom: var(--space-4);
  }
  
  li {
    margin-bottom: var(--space-2);
  }
</style>
