// Type definitions for sunburst-chart library
declare module 'sunburst-chart' {
  export default class Sunburst {
    // Constructor
    constructor(htmlElement: HTMLElement);

    // Data
    data(data: any): Sunburst;
    
    // Dimensions
    width(width: number): Sunburst;
    height(height: number): Sunburst;
    
    // Labels and formatting
    label(labelAccessor: string | ((d: any) => string)): Sunburst;
    size(sizeAccessor: string | ((d: any) => number)): Sunburst;
    color(colorAccessor: string | ((d: any, parent: any) => string)): Sunburst;
    centerLabel(label: string): Sunburst;
    tooltipTitle(titleAccessor: string | ((d: any) => string)): Sunburst;
    tooltipContent(contentAccessor: string | ((d: any) => string)): Sunburst;
    
    // Events
    onClick(callback: (node: any) => void): Sunburst;
  }
}
