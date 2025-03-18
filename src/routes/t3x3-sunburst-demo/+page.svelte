<script lang="ts">
  import { albums } from "$lib/data/albums";
  import { createMusicContext } from "$lib/context/music.svelte";
  import T3x3SunburstStandalone from "$lib/components/visualizations/T3x3SunburstStandalone.svelte";

  // Create a music context for this page
  const musicContext = createMusicContext();

  // Debug: Log all available albums
  console.log('T3x3 Demo: All available albums:', 
    albums.map(a => ({ id: a.id, title: a.title }))
  );

  // Set up fixed selections for demo
  function setupFixedSelections() {
    console.log('Setting up fixed album and song selections for sunburst demo');

    // Clear any existing selections first
    musicContext.clearSelections();
    
    // Find the specified albums
    const redAlbum = albums.find(a => a.title === "Red (Taylor's Version)");
    const repAlbum = albums.find(a => a.title === "Reputation");
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
      songs: Object.fromEntries(musicContext.selectedSongsByAlbum)
    });
  }

  // Call the setup function when page loads
  $effect(() => {
    console.log('T3x3 Sunburst Demo page loaded');
    // Setup fixed selections for testing
    setupFixedSelections();
  });
</script>

<div class="container">
  <h1>T3x3 Sunburst Demo</h1>
  <p class="description">
    This is a demo of the T3x3 Sunburst visualization with fixed values
    for testing purposes.
  </p>

  <div class="demo-info">
    <h2>Fixed Values</h2>
    <p>This demo uses the following fixed albums and songs for testing:</p>
    <ul>
      <li>
        <strong>Red (Taylor's Version)</strong>: "All Too Well", "The Last Time", "Begin Again"
      </li>
      <li>
        <strong>Reputation</strong>: "...Ready For It?", "New Year's Day", "Dancing With Our Hands Tied"
      </li>
      <li>
        <strong>Lover</strong>: "ME!", "I Think He Knows", "I Forgot That You Existed"
      </li>
    </ul>
  </div>

  <div class="visualization-container">
    <T3x3SunburstStandalone 
      title="My Taylor Swift T3x3" 
      centerLabel="Swiftie T3x3"
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
