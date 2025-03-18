<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  // Define the data structure for the t3x3 sunburst chart
  export type T3x3Node = {
    name: string;
    value?: number;
    children?: T3x3Node[];
  };

  // Component props
  export let data: T3x3Node = { 
    name: "Root",
    children: [] 
  };
  export let title = 'User T3x3 Preferences';
  export let width = '100%';
  export let height = '500px';
  export let colorScheme = d3.schemeCategory10;
  export let transitionDuration = 750;
  export let showLabels = true;
  export let showValues = true;
  export let centerText = "T3x3";

  // Local variables
  let container: HTMLDivElement;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  let tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  let chartWidth: number;
  let chartHeight: number;
  let radius: number;
  let arc: d3.Arc<any, d3.DefaultArcObject>;
  let color: d3.ScaleOrdinal<string, string>;
  let partition: d3.PartitionLayout<T3x3Node>;
  let root: d3.HierarchyNode<T3x3Node>;
  let currentDepth = 0;

  // Helper function to format values
  function formatValue(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }

  // Create and render the sunburst chart
  function createSunburst() {
    if (!container) return;

    // Clear previous chart if it exists
    d3.select(container).selectAll("*").remove();

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    chartWidth = containerRect.width;
    chartHeight = parseInt(height);
    radius = Math.min(chartWidth, chartHeight) / 2;

    // Create SVG element
    svg = d3.select(container)
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .append("g")
      .attr("transform", `translate(${chartWidth / 2},${chartHeight / 2})`);

    // Create tooltip
    tooltip = d3.select(container)
      .append("div")
      .attr("class", "sunburst-tooltip")
      .style("opacity", 0);

    // Create partition layout
    partition = d3.partition<T3x3Node>()
      .size([2 * Math.PI, radius * radius]);

    // Create arc generator
    arc = d3.arc<d3.HierarchyRectangularNode<T3x3Node>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => Math.sqrt(d.y0))
      .outerRadius(d => Math.sqrt(d.y1));

    // Create color scale
    color = d3.scaleOrdinal<string>(colorScheme);

    // Create hierarchy from data
    root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Apply partition layout
    partition(root);

    // Draw arcs
    const path = svg.selectAll("path")
      .data(root.descendants().slice(1)) // Skip root node
      .enter()
      .append("path")
      .attr("d", arc as any)
      .style("fill", d => color(d.data.name))
      .style("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 1)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave)
      .on("click", handleClick);

    // Add labels if enabled
    if (showLabels) {
      const label = svg.selectAll("text")
        .data(root.descendants().filter(d => (d.x1 - d.x0) > 0.1))
        .enter()
        .append("text")
        .attr("transform", d => {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = Math.sqrt(d.y0 + d.y1) / 2;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", "10px")
        .style("fill", "var(--text-on-primary)")
        .style("pointer-events", "none")
        .style("opacity", d => (d.x1 - d.x0) > 0.2 ? 1 : 0);
    }

    // Add center circle with text
    svg.append("circle")
      .attr("r", radius * 0.1)
      .style("fill", "var(--bg-container)")
      .style("stroke", "var(--color-primary)")
      .style("stroke-width", "2px")
      .on("click", () => zoomOut(root));

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("fill", "var(--text-primary)")
      .text(centerText);

    // Add title
    d3.select(container)
      .insert("div", ":first-child")
      .attr("class", "sunburst-title")
      .text(title);
  }

  // Event handlers
  function handleMouseOver(event: MouseEvent, d: d3.HierarchyRectangularNode<T3x3Node>) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    
    const tooltipContent = `
      <div class="tooltip-title">${d.data.name}</div>
      ${showValues && d.data.value ? `<div class="tooltip-value">${formatValue(d.data.value)}</div>` : ''}
    `;
    
    tooltip.html(tooltipContent);
  }

  function handleMouseMove(event: MouseEvent) {
    tooltip
      .style("left", `${event.offsetX + 10}px`)
      .style("top", `${event.offsetY + 10}px`);
  }

  function handleMouseLeave() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }

  function handleClick(event: MouseEvent, d: d3.HierarchyRectangularNode<T3x3Node>) {
    // Skip if node has no children
    if (!d.children) return;
    
    zoomIn(d);
  }

  // Zoom functions
  function zoomIn(clicked: d3.HierarchyRectangularNode<T3x3Node>) {
    currentDepth = clicked.depth;
    
    // Interpolate the arcs in data space
    const parent = clicked.parent || root;
    const x0 = parent.x0;
    const x1 = parent.x1;
    
    // Stash the old positions for transition
    root.each(d => {
      d.target = {
        x0: (d.x0 - clicked.x0) / (clicked.x1 - clicked.x0) * 2 * Math.PI,
        x1: (d.x1 - clicked.x0) / (clicked.x1 - clicked.x0) * 2 * Math.PI,
        y0: Math.max(0, Math.sqrt(d.y0) - Math.sqrt(clicked.y0)),
        y1: Math.max(0, Math.sqrt(d.y1) - Math.sqrt(clicked.y0))
      };
    });
    
    // Transition to the new view
    svg.selectAll("path")
      .transition()
      .duration(transitionDuration)
      .attrTween("d", d => {
        const i = d3.interpolate(
          { x0: d.x0, y0: d.y0, x1: d.x1, y1: d.y1 },
          { x0: d.target.x0, y0: d.target.y0 * d.target.y0, x1: d.target.x1, y1: d.target.y1 * d.target.y1 }
        );
        return t => arc(i(t) as any);
      })
      .on("end", function(d) {
        d.x0 = d.target.x0;
        d.x1 = d.target.x1;
        d.y0 = d.target.y0 * d.target.y0;
        d.y1 = d.target.y1 * d.target.y1;
      });
    
    // Update center text
    svg.select("text")
      .text(clicked.data.name);
  }

  function zoomOut(clicked: d3.HierarchyNode<T3x3Node>) {
    currentDepth = clicked.depth;
    
    if (clicked === root) return;
    
    const parent = clicked.parent || root;
    
    // Stash the old positions for transition
    root.each(d => {
      d.target = {
        x0: (d.x0 - parent.x0) / (parent.x1 - parent.x0) * 2 * Math.PI,
        x1: (d.x1 - parent.x0) / (parent.x1 - parent.x0) * 2 * Math.PI,
        y0: Math.sqrt(d.y0),
        y1: Math.sqrt(d.y1)
      };
    });
    
    // Transition to the new view
    svg.selectAll("path")
      .transition()
      .duration(transitionDuration)
      .attrTween("d", d => {
        const i = d3.interpolate(
          { x0: d.x0, y0: d.y0, x1: d.x1, y1: d.y1 },
          { x0: d.target.x0, y0: d.target.y0 * d.target.y0, x1: d.target.x1, y1: d.target.y1 * d.target.y1 }
        );
        return t => arc(i(t) as any);
      })
      .on("end", function(d) {
        d.x0 = d.target.x0;
        d.x1 = d.target.x1;
        d.y0 = d.target.y0 * d.target.y0;
        d.y1 = d.target.y1 * d.target.y1;
      });
    
    // Update center text
    svg.select("text")
      .text(centerText);
  }

  // Lifecycle hooks
  onMount(() => {
    createSunburst();
  });

  onDestroy(() => {
    // Clean up any event listeners or resources
    if (svg) {
      svg.selectAll("*").on("mouseover", null).on("mousemove", null).on("mouseleave", null).on("click", null);
    }
  });

  // Watch for data changes
  $: if (container && data) {
    createSunburst();
  }
</script>

<div class="t3x3-sunburst-container" bind:this={container} style="width: {width}; height: {height};">
  <!-- Chart will be rendered here -->
</div>

<style>
  .t3x3-sunburst-container {
    position: relative;
    background-color: var(--bg-container);
    border-radius: var(--radius-card);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
    margin: var(--space-4) 0;
  }

  :global(.sunburst-tooltip) {
    position: absolute;
    padding: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    font-size: 12px;
    z-index: 1000;
  }

  :global(.tooltip-title) {
    font-weight: bold;
    margin-bottom: 4px;
  }

  :global(.tooltip-value) {
    font-size: 11px;
  }

  :global(.sunburst-title) {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    color: var(--text-primary);
  }
</style>
