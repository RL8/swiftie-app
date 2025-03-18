<script lang="ts">
  import { albums } from "$lib/data/albums";
  import { createMusicContext } from "$lib/context/music.svelte";
  import T3x3SunburstStandalone from "$lib/components/visualizations/T3x3SunburstStandalone.svelte";
  import type { Album } from "$lib/data/albums";
  import type { T3x3Node } from "$lib/utils/t3x3DataGenerator";

  // Create a music context for this page
  const musicContext = createMusicContext();
  
  // Create a separate context for the T11x3 visualization
  const t11x3Context = createMusicContext();

  // Debug: Log all available albums
  console.log('T3x3 Demo: All available albums:', 
    albums.map(a => ({ id: a.id, title: a.title }))
  );

  // Set up fixed selections for T3x3 demo
  function setupFixedSelections() {
    console.log('Setting up fixed album and song selections for T3x3 demo');

    // Clear any existing selections first
    musicContext.clearSelections();
    
    // Find the specified albums - using exact titles from albums.ts
    const redAlbum = albums.find(a => a.title === "Red TV");
    const repAlbum = albums.find(a => a.title === "reputation");
    const loverAlbum = albums.find(a => a.title === "Lover");

    console.log('Found albums for T3x3 demo:', { redAlbum, repAlbum, loverAlbum });

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
    console.log('Final T3x3 selections:', {
      albums: musicContext.selectedAlbums.map(a => ({ id: a.id, title: a.title })),
      songs: Object.fromEntries(Array.from(musicContext.selectedSongsByAlbum.entries()))
    });
  }
  
  // Set up all 11 albums for T11x3 demo
  function setupT11x3Selections() {
    console.log('Setting up all 11 albums for T11x3 demo');
    
    // Clear any existing selections
    t11x3Context.clearSelections();
    
    // Album and song selections for T11x3
    const albumSelections = [
      { 
        title: "Debut", 
        songs: ["Our Song", "Teardrops on My Guitar", "Picture to Burn"] 
      },
      { 
        title: "Fearless TV", 
        songs: ["Love Story", "You Belong With Me", "Fifteen"] 
      },
      { 
        title: "Speak Now TV", 
        songs: ["Enchanted", "Mean", "Sparks Fly"] 
      },
      { 
        title: "Red TV", 
        songs: ["All Too Well", "The Last Time", "Begin Again"] 
      },
      { 
        title: "1989 TV", 
        songs: ["Blank Space", "Style", "Wildest Dreams"] 
      },
      { 
        title: "reputation", 
        songs: ["...Ready For It?", "New Year's Day", "Dancing With Our Hands Tied"] 
      },
      { 
        title: "Lover", 
        songs: ["ME!", "I Think He Knows", "I Forgot That You Existed"] 
      },
      { 
        title: "folklore", 
        songs: ["cardigan", "august", "exile"] 
      },
      { 
        title: "evermore", 
        songs: ["willow", "champagne problems", "no body, no crime"] 
      },
      { 
        title: "Midnights", 
        songs: ["Anti-Hero", "Lavender Haze", "Bejeweled"] 
      },
      { 
        title: "The Tortured Poets Department", 
        songs: ["Fortnight", "The Alchemy", "Down Bad"] 
      }
    ];
    
    // Process each album selection
    albumSelections.forEach(selection => {
      const album = albums.find(a => a.title === selection.title);
      if (album) {
        t11x3Context.selectAlbum(album);
        t11x3Context.updateSelectedSongs(album.id, selection.songs);
        console.log(`T11x3: Set songs for ${album.title}:`, selection.songs);
      } else {
        console.error(`T11x3: Album not found: ${selection.title}`);
      }
    });
    
    // Log the final T11x3 selections
    console.log('Final T11x3 selections:', {
      albums: t11x3Context.selectedAlbums.map(a => ({ id: a.id, title: a.title })),
      songs: Object.fromEntries(Array.from(t11x3Context.selectedSongsByAlbum.entries()))
    });
  }

  // Call the setup functions when page loads
  $effect(() => {
    console.log('Sunburst Demo page loaded');
    // Setup fixed selections for testing
    setupFixedSelections();
    setupT11x3Selections();
  });
  
  // Generate a custom T11x3 data structure for direct use
  function generateT11x3Data(): T3x3Node {
    console.log('Generating T11x3 data structure');
    
    // Create the root node
    const rootNode: T3x3Node = {
      name: "Taylor Swift T11×3",
      children: []
    };
    
    // Add all selected albums as children
    t11x3Context.selectedAlbums.forEach(album => {
      const albumNode: T3x3Node = {
        name: album.title,
        children: []
      };
      
      // Get selected songs for this album
      const selectedSongs = t11x3Context.selectedSongsByAlbum.get(album.id) || [];
      
      // Add songs as children of the album
      selectedSongs.forEach(song => {
        albumNode.children.push({
          name: song,
          value: 100 // Equal value for all songs
        });
      });
      
      // Add the album node to the root
      rootNode.children.push(albumNode);
    });
    
    return rootNode;
  }
</script>

<div class="page-container">
  <header>
    <h1>Taylor Swift Sunburst Visualizations</h1>
    <p class="subtitle">Interactive visualizations of Taylor Swift's discography</p>
  </header>

  <section class="visualization-section t3x3-section">
    <div class="section-header">
      <h2>T3×3 Sunburst</h2>
      <p>A visualization of 3 albums with 3 songs each</p>
    </div>

    <div class="info-card">
      <h3>Selected Albums & Songs</h3>
      <ul class="album-list">
        <li>
          <strong>Red TV</strong>: "All Too Well", "The Last Time", "Begin Again"
        </li>
        <li>
          <strong>reputation</strong>: "...Ready For It?", "New Year's Day", "Dancing With Our Hands Tied"
        </li>
        <li>
          <strong>Lover</strong>: "ME!", "I Think He Knows", "I Forgot That You Existed"
        </li>
      </ul>
    </div>

    <div class="visualization-container">
      <T3x3SunburstStandalone 
        title="Taylor Swift T3×3" 
        centerLabel="T3×3"
        height="600px"
        userSelectedAlbums={musicContext.selectedAlbums}
        userSelectedSongs={musicContext.selectedSongsByAlbum}
      />
    </div>
  </section>

  <div class="section-divider">
    <span>•</span><span>•</span><span>•</span>
  </div>

  <section class="visualization-section t11x3-section">
    <div class="section-header">
      <h2>T11×3 Sunburst</h2>
      <p>A visualization of all 11 albums with 3 songs each</p>
    </div>

    <div class="info-card">
      <h3>All Taylor Swift Albums</h3>
      <p>This visualization includes all 11 Taylor Swift albums with 3 songs from each album.</p>
      
      <div class="albums-preview">
        <h4>Albums Included:</h4>
        <ul class="album-list two-column">
          <li><strong>Debut</strong>: "Our Song", "Teardrops on My Guitar", "Picture to Burn"</li>
          <li><strong>Fearless TV</strong>: "Love Story", "You Belong With Me", "Fifteen"</li>
          <li><strong>Speak Now TV</strong>: "Enchanted", "Mean", "Sparks Fly"</li>
          <li><strong>Red TV</strong>: "All Too Well", "The Last Time", "Begin Again"</li>
          <li><strong>1989 TV</strong>: "Blank Space", "Style", "Wildest Dreams"</li>
          <li><strong>reputation</strong>: "...Ready For It?", "New Year's Day", "Dancing With Our Hands Tied"</li>
          <li><strong>Lover</strong>: "ME!", "I Think He Knows", "I Forgot That You Existed"</li>
          <li><strong>folklore</strong>: "cardigan", "august", "exile"</li>
          <li><strong>evermore</strong>: "willow", "champagne problems", "no body, no crime"</li>
          <li><strong>Midnights</strong>: "Anti-Hero", "Lavender Haze", "Bejeweled"</li>
          <li><strong>The Tortured Poets Department</strong>: "Fortnight", "The Alchemy", "Down Bad"</li>
        </ul>
      </div>
    </div>

    <div class="visualization-container">
      <T3x3SunburstStandalone 
        title="Taylor Swift T11×3" 
        centerLabel="T11×3"
        height="700px"
        userSelectedAlbums={t11x3Context.selectedAlbums}
        userSelectedSongs={t11x3Context.selectedSongsByAlbum}
      />
    </div>
  </section>
</div>

<style>
  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  h1 {
    color: #1DB954;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
  }

  .subtitle {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 0;
  }

  .visualization-section {
    margin-bottom: 3rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  .section-header p {
    color: #666;
    margin-top: 0;
  }

  .info-card {
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .info-card h3 {
    margin-top: 0;
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .album-list {
    padding-left: 1.5rem;
    margin-bottom: 0;
  }
  
  .two-column {
    column-count: 2;
    column-gap: 2rem;
  }

  .album-list li {
    margin-bottom: 0.75rem;
    line-height: 1.5;
    break-inside: avoid; /* Prevent items from breaking across columns */
  }

  .visualization-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .section-divider {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3rem 0;
    color: #ccc;
    font-size: 1.5rem;
    letter-spacing: 1rem;
  }

  .placeholder {
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    border: 2px dashed #ddd;
  }

  .placeholder-content {
    text-align: center;
    padding: 2rem;
    max-width: 500px;
  }

  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .albums-preview {
    margin-top: 1.5rem;
  }

  .albums-preview h4 {
    margin-bottom: 1rem;
    color: #555;
  }

  @media (max-width: 768px) {
    .page-container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .section-header h2 {
      font-size: 1.5rem;
    }
    
    .info-card, .visualization-container {
      padding: 1rem;
    }
    
    .two-column {
      column-count: 1;
    }
  }
</style>
