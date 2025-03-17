<script lang="ts">
    import SunburstChart from './SunburstChart.svelte';
    
    export let userName = "Taylor Fan";
    export let favoriteAlbums = ["Red TV", "1989 TV", "Folklore"];
    export let topSongs = [
        { title: "All Too Well", album: "Red TV", plays: 120 },
        { title: "Blank Space", album: "1989 TV", plays: 95 },
        { title: "Cardigan", album: "Folklore", plays: 87 },
        { title: "Cruel Summer", album: "Lover", plays: 76 },
        { title: "Anti-Hero", album: "Midnights", plays: 65 }
    ];
    
    const albumColors: Record<string, string> = {
        "Red TV": "#B02428",
        "1989 TV": "#8CD1E6",
        "Folklore": "#ACA9A0",
        "Lover": "#E8C1E1",
        "Midnights": "#1A1A3D"
    };
    
    // Mock data for the sunburst chart
    const mockData = {
        name: "Music Preferences",
        children: [
            { name: "Red TV", value: 35 },
            { name: "1989 TV", value: 30 },
            { name: "Folklore", value: 25 },
            { name: "Lover", value: 15 },
            { name: "Midnights", value: 10 }
        ]
    };
</script>

<div class="dashboard">
    <header class="dashboard-header">
        <h1>{userName}'s Taylor Swift Profile</h1>
        <p class="subtitle">Your personalized music journey</p>
    </header>
    
    <div class="dashboard-content">
        <div class="visualization-section">
            <div class="chart-container">
                <h2>Album Preferences</h2>
                <SunburstChart 
                    data={mockData} 
                    title="Your Taylor Swift Universe" 
                    height="350px"
                />
            </div>
            
            <div class="stats-container">
                <div class="stats-card">
                    <h3>Top Songs</h3>
                    <ul class="song-list">
                        {#each topSongs as song, i}
                            <li class="song-item" style="--album-color: {albumColors[song.album] || '#333'}">
                                <span class="song-rank">{i + 1}</span>
                                <div class="song-info">
                                    <span class="song-title">{song.title}</span>
                                    <span class="song-album">{song.album}</span>
                                </div>
                                <span class="song-plays">{song.plays} plays</span>
                            </li>
                        {/each}
                    </ul>
                </div>
                
                <div class="stats-card">
                    <h3>Favorite Albums</h3>
                    <div class="album-badges">
                        {#each favoriteAlbums as album}
                            <span class="album-badge" style="background-color: {albumColors[album] || '#333'}">
                                {album}
                            </span>
                        {/each}
                    </div>
                    
                    <div class="listening-stats">
                        <div class="stat-item">
                            <span class="stat-value">42</span>
                            <span class="stat-label">Hours Listened</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">187</span>
                            <span class="stat-label">Songs Played</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .dashboard {
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .dashboard-header {
        background: linear-gradient(135deg, #E8C1E1, #B02428);
        color: white;
        padding: 24px;
        text-align: center;
    }
    
    .dashboard-header h1 {
        margin: 0;
        font-size: 24px;
    }
    
    .subtitle {
        margin: 8px 0 0;
        opacity: 0.9;
    }
    
    .dashboard-content {
        padding: 24px;
    }
    
    .visualization-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    
    .chart-container, .stats-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    
    .stats-card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .stats-card h3 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 18px;
        color: #333;
    }
    
    .song-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .song-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-left: 3px solid var(--album-color);
        padding-left: 8px;
        margin-bottom: 8px;
    }
    
    .song-rank {
        font-weight: bold;
        font-size: 18px;
        width: 24px;
        text-align: center;
        color: #555;
    }
    
    .song-info {
        flex: 1;
        margin-left: 12px;
    }
    
    .song-title {
        display: block;
        font-weight: 500;
    }
    
    .song-album {
        display: block;
        font-size: 12px;
        color: #777;
    }
    
    .song-plays {
        font-size: 12px;
        color: #777;
    }
    
    .album-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }
    
    .album-badge {
        padding: 6px 12px;
        border-radius: 16px;
        color: white;
        font-size: 14px;
    }
    
    .listening-stats {
        display: flex;
        justify-content: space-around;
        margin-top: 16px;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-value {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }
    
    .stat-label {
        font-size: 12px;
        color: #777;
    }
    
    @media (max-width: 768px) {
        .visualization-section {
            grid-template-columns: 1fr;
        }
    }
</style>
