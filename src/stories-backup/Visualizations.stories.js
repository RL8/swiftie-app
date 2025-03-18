import MusicProfileDashboard from '$lib/components/visualizations/MusicProfileDashboard.svelte';
import SocialComparisonView from '$lib/components/visualizations/SocialComparisonView.svelte';
import SunburstChart from '$lib/components/visualizations/SunburstChart.svelte';

export default {
  title: 'Visualizations/Sunburst Charts',
  component: SunburstChart,
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#fff1f2' },
        { name: 'light', value: '#fecdd3' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
};

export const BasicSunburstChart = {
  render: () => ({
    Component: SunburstChart,
    props: {
      title: 'Album Preferences',
      data: {
        name: "Music",
        children: [
          { name: "Red TV", value: 35 },
          { name: "1989 TV", value: 30 },
          { name: "Folklore", value: 25 },
          { name: "Lover", value: 10 }
        ]
      }
    }
  })
};

export const MusicProfileDashboardStory = {
  render: () => ({
    Component: MusicProfileDashboard,
    props: {
      userName: "Swiftie Fan",
      favoriteAlbums: ["Red TV", "1989 TV", "Folklore"],
      topSongs: [
        { title: "All Too Well", album: "Red TV", plays: 120 },
        { title: "Blank Space", album: "1989 TV", plays: 95 },
        { title: "Cardigan", album: "Folklore", plays: 87 },
        { title: "Cruel Summer", album: "Lover", plays: 76 },
        { title: "Anti-Hero", album: "Midnights", plays: 65 }
      ]
    }
  })
};

export const SocialComparisonViewStory = {
  render: () => ({
    Component: SocialComparisonView,
    props: {
      userName: "Taylor Fan",
      friendName: "Swiftie Friend",
      matchPercentage: 78,
      sharedFavorites: ["All Too Well", "Blank Space", "Cruel Summer"],
      userTopAlbums: ["Red TV", "1989 TV", "Folklore"],
      friendTopAlbums: ["1989 TV", "Midnights", "Lover"]
    }
  })
};
