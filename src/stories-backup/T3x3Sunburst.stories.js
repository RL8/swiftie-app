import T3x3Sunburst from '../lib/components/visualizations/T3x3Sunburst.svelte';

// Sample data for T3x3 visualization
const sampleData = {
  name: "T3x3 Preferences",
  children: [
    {
      name: "Pop",
      value: 1200,
      children: [
        { name: "Taylor Swift", value: 500 },
        { name: "Ariana Grande", value: 300 },
        { name: "Billie Eilish", value: 250 },
        { name: "Dua Lipa", value: 150 }
      ]
    },
    {
      name: "Rock",
      value: 900,
      children: [
        { name: "Queen", value: 300 },
        { name: "The Beatles", value: 250 },
        { name: "Led Zeppelin", value: 200 },
        { name: "AC/DC", value: 150 }
      ]
    },
    {
      name: "Hip Hop",
      value: 800,
      children: [
        { name: "Drake", value: 250 },
        { name: "Kendrick Lamar", value: 200 },
        { name: "Eminem", value: 200 },
        { name: "Kanye West", value: 150 }
      ]
    },
    {
      name: "Electronic",
      value: 600,
      children: [
        { name: "Daft Punk", value: 200 },
        { name: "Calvin Harris", value: 150 },
        { name: "Avicii", value: 150 },
        { name: "Skrillex", value: 100 }
      ]
    },
    {
      name: "R&B",
      value: 500,
      children: [
        { name: "The Weeknd", value: 150 },
        { name: "Beyoncé", value: 150 },
        { name: "Frank Ocean", value: 100 },
        { name: "SZA", value: 100 }
      ]
    }
  ]
};

// More complex nested data for T3x3
const complexData = {
  name: "Music Preferences",
  children: [
    {
      name: "Pop",
      children: [
        {
          name: "Taylor Swift",
          value: 500,
          children: [
            { name: "Folklore", value: 150 },
            { name: "1989", value: 120 },
            { name: "Red", value: 100 },
            { name: "Midnights", value: 130 }
          ]
        },
        {
          name: "Ariana Grande",
          value: 300,
          children: [
            { name: "Thank U, Next", value: 120 },
            { name: "Positions", value: 100 },
            { name: "Sweetener", value: 80 }
          ]
        }
      ]
    },
    {
      name: "Rock",
      children: [
        {
          name: "Classic Rock",
          children: [
            { name: "Queen", value: 200 },
            { name: "The Beatles", value: 180 },
            { name: "Led Zeppelin", value: 150 }
          ]
        },
        {
          name: "Alternative Rock",
          children: [
            { name: "Radiohead", value: 120 },
            { name: "Arctic Monkeys", value: 110 },
            { name: "The Strokes", value: 90 }
          ]
        }
      ]
    }
  ]
};

// User-specific T3x3 data
const userT3x3Data = {
  name: "User T3x3",
  children: [
    {
      name: "Top Artists",
      value: 900,
      children: [
        { name: "Taylor Swift", value: 300 },
        { name: "Drake", value: 250 },
        { name: "The Weeknd", value: 200 },
        { name: "Billie Eilish", value: 150 }
      ]
    },
    {
      name: "Top Albums",
      value: 700,
      children: [
        { name: "Midnights", value: 200 },
        { name: "After Hours", value: 180 },
        { name: "Certified Lover Boy", value: 170 },
        { name: "Happier Than Ever", value: 150 }
      ]
    },
    {
      name: "Top Genres",
      value: 500,
      children: [
        { name: "Pop", value: 200 },
        { name: "Hip Hop", value: 150 },
        { name: "R&B", value: 100 },
        { name: "Alternative", value: 50 }
      ]
    }
  ]
};

export default {
  title: 'Visualizations/T3x3Sunburst',
  component: T3x3Sunburst,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    showLabels: { control: 'boolean' },
    showValues: { control: 'boolean' },
    transitionDuration: { 
      control: { type: 'range', min: 0, max: 2000, step: 100 }
    },
    centerText: { control: 'text' },
    colorScheme: { 
      control: 'select',
      options: ['schemeCategory10', 'schemeAccent', 'schemeDark2', 'schemePaired', 'schemePastel1', 'schemePastel2', 'schemeSet1', 'schemeSet2', 'schemeSet3'],
      mapping: {
        schemeCategory10: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
        schemeAccent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
        schemeDark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
        schemePaired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
        schemePastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
        schemePastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
        schemeSet1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
        schemeSet2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
        schemeSet3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f']
      }
    }
  },
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f4f4f4' },
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
};

export const Default = {
  args: {
    data: sampleData,
    title: 'Music Genre Preferences',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'Music',
    colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
  },
};

export const ComplexNested = {
  args: {
    data: complexData,
    title: 'Detailed Music Preferences',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'Music',
    colorScheme: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3']
  },
};

export const UserT3x3 = {
  args: {
    data: userT3x3Data,
    title: 'User T3x3 Visualization',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'T3x3',
    colorScheme: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf']
  },
};

export const Compact = {
  args: {
    data: sampleData,
    title: 'Compact T3x3 View',
    width: '300px',
    height: '300px',
    showLabels: false,
    showValues: true,
    transitionDuration: 500,
    centerText: 'T3x3',
    colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f']
  },
};

export const NoLabels = {
  args: {
    data: sampleData,
    title: 'T3x3 Without Labels',
    width: '100%',
    height: '500px',
    showLabels: false,
    showValues: true,
    transitionDuration: 750,
    centerText: 'T3x3',
    colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f']
  },
};

export const CustomColors = {
  args: {
    data: sampleData,
    title: 'T3x3 with Custom Colors',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'T3x3',
    colorScheme: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5']
  },
};
