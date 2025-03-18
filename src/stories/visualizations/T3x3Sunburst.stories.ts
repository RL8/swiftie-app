import T3x3Sunburst from '../../lib/components/visualizations/T3x3Sunburst.svelte';
import { generateTaylorSwiftData } from '../../lib/utils/sunburstDataGenerator';
import * as d3 from 'd3';

// Define interfaces for our data structures
interface SongData {
  name: string;
  value: number;
}

interface AlbumData {
  name: string;
  children: SongData[];
}

interface ArtistData {
  name: string;
  children: AlbumData[];
}

interface AlbumInfo {
  name: string;
  songs: string[];
}

// Helper function to map color scheme string to actual d3 color scheme
const getColorScheme = (schemeName: string): string[] => {
  switch (schemeName) {
    case 'schemeCategory10': return d3.schemeCategory10;
    case 'schemeAccent': return d3.schemeAccent;
    case 'schemeDark2': return d3.schemeDark2;
    case 'schemePaired': return d3.schemePaired;
    case 'schemePastel1': return d3.schemePastel1;
    case 'schemePastel2': return d3.schemePastel2;
    case 'schemeSet1': return d3.schemeSet1;
    case 'schemeSet2': return d3.schemeSet2;
    case 'schemeSet3': return d3.schemeSet3;
    default: return d3.schemeCategory10;
  }
};

// Create a T3x3 data structure - top 3 songs from top 3 albums
const createT3x3Data = (artistName: string, albums: AlbumInfo[]): ArtistData => {
  // Select top 3 albums (or fewer if not enough)
  const topAlbums = albums.slice(0, 3);
  
  return {
    name: artistName,
    children: topAlbums.map(album => ({
      name: album.name,
      children: album.songs.slice(0, 3).map(song => ({
        name: song,
        value: Math.floor(Math.random() * 50) + 50 // Random popularity value
      }))
    }))
  };
};

// Taylor Swift T3x3 data
const taylorSwiftT3x3 = createT3x3Data("Taylor Swift", [
  {
    name: "Midnights",
    songs: ["Anti-Hero", "Lavender Haze", "Bejeweled", "Karma", "Snow On The Beach"]
  },
  {
    name: "Folklore",
    songs: ["Cardigan", "August", "Exile", "The 1", "Betty"]
  },
  {
    name: "1989",
    songs: ["Blank Space", "Style", "Shake It Off", "Wildest Dreams", "Bad Blood"]
  }
]);

// Ariana Grande T3x3 data
const arianaGrandeT3x3 = createT3x3Data("Ariana Grande", [
  {
    name: "Thank U, Next",
    songs: ["Thank U, Next", "7 Rings", "Break Up with Your Girlfriend, I'm Bored", "Imagine", "Bloodline"]
  },
  {
    name: "Positions",
    songs: ["Positions", "34+35", "POV", "Safety Net", "Just Like Magic"]
  },
  {
    name: "Sweetener",
    songs: ["God Is a Woman", "No Tears Left to Cry", "Breathin", "R.E.M", "Sweetener"]
  }
]);

// The Weeknd T3x3 data
const theWeekndT3x3 = createT3x3Data("The Weeknd", [
  {
    name: "After Hours",
    songs: ["Blinding Lights", "Save Your Tears", "In Your Eyes", "After Hours", "Heartless"]
  },
  {
    name: "Dawn FM",
    songs: ["Sacrifice", "Take My Breath", "Out of Time", "Less Than Zero", "Gasoline"]
  },
  {
    name: "Starboy",
    songs: ["Starboy", "I Feel It Coming", "Die For You", "Party Monster", "Reminder"]
  }
]);

// User's custom T3x3 data (random selection)
const userCustomT3x3: ArtistData = {
  name: "My T3x3",
  children: [
    {
      name: "Folklore (Taylor Swift)",
      children: [
        { name: "Cardigan", value: 95 },
        { name: "August", value: 88 },
        { name: "The 1", value: 82 }
      ]
    },
    {
      name: "After Hours (The Weeknd)",
      children: [
        { name: "Blinding Lights", value: 92 },
        { name: "Save Your Tears", value: 85 },
        { name: "After Hours", value: 79 }
      ]
    },
    {
      name: "Renaissance (Beyoncé)",
      children: [
        { name: "CUFF IT", value: 90 },
        { name: "ALIEN SUPERSTAR", value: 84 },
        { name: "BREAK MY SOUL", value: 78 }
      ]
    }
  ]
};

// Storybook configuration
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

// Define the template type for Storybook
type Story = {
  args: {
    data: ArtistData;
    title: string;
    width: string;
    height: string;
    showLabels: boolean;
    showValues: boolean;
    transitionDuration: number;
    centerText: string;
    colorScheme: string | string[];
  }
};

// Template for stories
const Template = (args: any) => {
  // Map the color scheme string to actual d3 color scheme if it's a string
  if (typeof args.colorScheme === 'string') {
    args.colorScheme = getColorScheme(args.colorScheme);
  }
  
  return {
    Component: T3x3Sunburst,
    props: args
  };
};

// Create the stories
export const TaylorSwiftT3x3: Story = {
  args: {
    data: taylorSwiftT3x3,
    title: 'Taylor Swift T3x3',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'Taylor Swift',
    colorScheme: 'schemeSet3'
  }
};

export const ArianaGrandeT3x3: Story = {
  args: {
    data: arianaGrandeT3x3,
    title: 'Ariana Grande T3x3',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'Ariana Grande',
    colorScheme: 'schemePastel1'
  }
};

export const TheWeekndT3x3: Story = {
  args: {
    data: theWeekndT3x3,
    title: 'The Weeknd T3x3',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'The Weeknd',
    colorScheme: 'schemeDark2'
  }
};

export const UserCustomT3x3: Story = {
  args: {
    data: userCustomT3x3,
    title: 'My T3x3',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'My T3x3',
    colorScheme: 'schemeCategory10'
  }
};

export const CompactT3x3: Story = {
  args: {
    data: taylorSwiftT3x3,
    title: 'Compact T3x3 View',
    width: '300px',
    height: '300px',
    showLabels: false,
    showValues: true,
    transitionDuration: 500,
    centerText: 'T3x3',
    colorScheme: 'schemeCategory10'
  }
};

export const DarkThemeT3x3: Story = {
  args: {
    data: theWeekndT3x3,
    title: 'Dark Theme T3x3',
    width: '100%',
    height: '500px',
    showLabels: true,
    showValues: true,
    transitionDuration: 750,
    centerText: 'T3x3',
    colorScheme: 'schemeDark2'
  }
};
