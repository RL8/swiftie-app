<script lang="ts">
  import { albums } from "$lib/data/albums";
  import { createMusicContext } from "$lib/context/music.svelte";
  import T3x3SunburstStandalone from "$lib/components/visualizations/T3x3SunburstStandalone.svelte";

  // Create a music context for this page
  const musicContext = createMusicContext();

  // Debug: Log all available albums
  console.log('T11x3 Demo: All available albums:', 
    albums.map(a => ({ id: a.id, title: a.title }))
  );

  // Set up fixed selections for demo
  function setupFixedSelections() {
    console.log('Setting up fixed album and song selections for sunburst demo');

    // Clear any existing selections first
    musicContext.clearSelections();
    
    // Find the specified albums - using exact titles from albums.ts
    const redAlbum = albums.find(a => a.title === "Red TV");
    const repAlbum = albums.find(a => a.title === "reputation");
    const loverAlbum = albums.find(a => a.title === "Lover");

    console.log('Found albums for demo:', { redAlbum, repAlbum, loverAlbum });

    // Add them to the selected albums
    if (redAlbum) {
      musicContext.selectAlbum(redAlbum);
      // Set specific songs for this album
      const redSongs = ["All Too Well", "The Last Time", "Begin Again"];
      musicContext.updateSelectedSongs(redAlbum.id, redSongs);
      console.log(`Set songs for ${redAlbum.title}:`, redSongs);
    } else {
      console.error('Red album not found!');
    }

    if (repAlbum) {
      musicContext.selectAlbum(repAlbum);
      // Set specific songs for this album
      const repSongs = ["...Ready For It?", "New Year's Day", "Dancing With Our Hands Tied"];
      musicContext.updateSelectedSongs(repAlbum.id, repSongs);
      console.log(`Set songs for ${repAlbum.title}:`, repSongs);
    } else {
      console.error('Reputation album not found!');
    }

    if (loverAlbum) {
      musicContext.selectAlbum(loverAlbum);
      // Set specific songs for this album
      const loverSongs = ["ME!", "I Think He Knows", "I Forgot That You Existed"];
      musicContext.updateSelectedSongs(loverAlbum.id, loverSongs);
      console.log(`Set songs for ${loverAlbum.title}:`, loverSongs);
    } else {
      console.error('Lover album not found!');
    }

    // Log the final selections
    console.log('Final selections:', {
      albums: musicContext.selectedAlbums.map(a => ({ id: a.id, title: a.title })),
      songs: Object.fromEntries(Array.from(musicContext.selectedSongsByAlbum.entries()))
    });
  }

  // Call the setup function when page loads
  $effect(() => {
    console.log('T11x3 Sunburst Demo page loaded');
    // Setup fixed selections for testing
    setupFixedSelections();
  });
</script>

<div class="container">
  <h1>T11x3 Sunburst Demo</h1>
  <p class="description">
    This is a demo of the T11x3 Sunburst visualization with fixed values
    for testing purposes.
  </p>

  <div class="demo-info">
    <h2>T11x3 Album Selection</h2>
    <p>This visualization displays 11 albums with 3 songs from each:</p>
    <ul>
      <li>
        <strong>Debut</strong>: "Tim McGraw", "Should've Said No", "Our Song"
      </li>
      <li>
        <strong>Fearless TV</strong>: "Love Story", "You Belong With Me", "Fifteen"
      </li>
      <li>
        <strong>Speak Now TV</strong>: "Enchanted", "Sparks Fly", "Dear John"
      </li>
      <li>
        <strong>Red TV</strong>: "All Too Well", "State Of Grace", "I Knew You Were Trouble"
      </li>
      <li>
        <strong>1989 TV</strong>: "Blank Space", "Style", "Wildest Dreams"
      </li>
      <li>
        <strong>reputation</strong>: "Delicate", "Getaway Car", "Don't Blame Me"
      </li>
      <li>
        <strong>Lover</strong>: "Cruel Summer", "Cornelia Street", "Lover"
      </li>
      <li>
        <strong>folklore</strong>: "august", "cardigan", "exile"
      </li>
      <li>
        <strong>evermore</strong>: "champagne problems", "willow", "gold rush"
      </li>
      <li>
        <strong>Midnights</strong>: "Anti-Hero", "Lavender Haze", "Bejeweled"
      </li>
      <li>
        <strong>The Tortured Poets Department</strong>: "Fortnight", "The Alchemy", "So Long, London"
      </li>
    </ul>
  </div>

  <div class="visualization-container">
    <T3x3SunburstStandalone 
      title="My Taylor Swift T11x3" 
      centerLabel="Swiftie T11x3"
      height="600px"
      userSelectedAlbums={musicContext.selectedAlbums}
      userSelectedSongs={musicContext.selectedSongsByAlbum}
    />
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  h1 {
    color: #1DB954;
    text-align: center;
    margin-bottom: 1rem;
  }

  .description {
    text-align: center;
    margin-bottom: 2rem;
    color: #666;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .demo-info {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .demo-info h2 {
    margin-top: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .demo-info ul {
    padding-left: 1.5rem;
  }

  .demo-info li {
    margin-bottom: 0.5rem;
  }

  .visualization-container {
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
</style>
