<script>
  import MusicProfileDashboard from '$lib/components/visualizations/MusicProfileDashboard.svelte';
  import SocialComparisonView from '$lib/components/visualizations/SocialComparisonView.svelte';
  import SunburstChart from '$lib/components/visualizations/SunburstChart.svelte';
</script>

<script context="module">
  export const meta = {
    title: 'Visualizations/Sunburst Charts',
    component: SunburstChart
  };
</script>

<div style="max-width: 1200px; margin: 0 auto;">
  <h2>Basic Sunburst Chart</h2>
  <SunburstChart 
    title="Album Preferences"
    data={{
      name: "Music",
      children: [
        { name: "Red TV", value: 35 },
        { name: "1989 TV", value: 30 },
        { name: "Folklore", value: 25 },
        { name: "Lover", value: 10 }
      ]
    }}
  />

  <h2>Music Profile Dashboard</h2>
  <MusicProfileDashboard 
    userName="Swiftie Fan"
    favoriteAlbums={["Red TV", "1989 TV", "Folklore"]}
    topSongs={[
      { title: "All Too Well", album: "Red TV", plays: 120 },
      { title: "Blank Space", album: "1989 TV", plays: 95 },
      { title: "Cardigan", album: "Folklore", plays: 87 },
      { title: "Cruel Summer", album: "Lover", plays: 76 },
      { title: "Anti-Hero", album: "Midnights", plays: 65 }
    ]}
  />

  <h2>Social Comparison View</h2>
  <SocialComparisonView 
    userName="Taylor Fan"
    friendName="Swiftie Friend"
    matchPercentage={78}
    sharedFavorites={["All Too Well", "Blank Space", "Cruel Summer"]}
    userTopAlbums={["Red TV", "1989 TV", "Folklore"]}
    friendTopAlbums={["1989 TV", "Midnights", "Lover"]}
  />
</div>
