<script lang="ts">
    import SunburstChart from './SunburstChart.svelte';
    
    export let userName = "Taylor Fan";
    export let friendName = "Swiftie Friend";
    export let matchPercentage = 78;
    export let sharedFavorites = ["All Too Well", "Blank Space", "Cruel Summer"];
    export let userTopAlbums = ["Red TV", "1989 TV", "Folklore"];
    export let friendTopAlbums = ["1989 TV", "Midnights", "Lover"];
    
    const albumColors: Record<string, string> = {
        "Red TV": "#B02428",
        "1989 TV": "#8CD1E6",
        "Folklore": "#ACA9A0",
        "Lover": "#E8C1E1",
        "Midnights": "#1A1A3D"
    };
    
    // Mock data for the sunburst charts
    const userData = {
        name: "Your Preferences",
        children: [
            { name: "Red TV", value: 35 },
            { name: "1989 TV", value: 30 },
            { name: "Folklore", value: 25 },
            { name: "Lover", value: 10 }
        ]
    };
    
    const friendData = {
        name: "Friend's Preferences",
        children: [
            { name: "1989 TV", value: 40 },
            { name: "Midnights", value: 30 },
            { name: "Lover", value: 20 },
            { name: "Folklore", value: 10 }
        ]
    };
    
    // Recommendations based on friend's preferences
    const recommendations = [
        { title: "Bejeweled", album: "Midnights" },
        { title: "Lavender Haze", album: "Midnights" },
        { title: "Paper Rings", album: "Lover" }
    ];
</script>

<div class="comparison-container">
    <header class="comparison-header">
        <h1>Taylor Swift Taste Match</h1>
        <div class="users">
            <span class="user">{userName}</span>
            <div class="match-indicator">
                <div class="match-percentage">{matchPercentage}%</div>
                <div class="match-label">match</div>
            </div>
            <span class="friend">{friendName}</span>
        </div>
    </header>
    
    <div class="comparison-content">
        <div class="charts-container">
            <div class="chart-wrapper">
                <h3>Your Taste</h3>
                <SunburstChart 
                    data={userData} 
                    title="Your Favorites" 
                    height="300px"
                />
            </div>
            
            <div class="chart-wrapper">
                <h3>{friendName}'s Taste</h3>
                <SunburstChart 
                    data={friendData} 
                    title="Friend's Favorites" 
                    height="300px"
                />
            </div>
        </div>
        
        <div class="shared-section">
            <h2>Your Shared Favorites</h2>
            <div class="shared-items">
                {#each sharedFavorites as song}
                    <div class="shared-item">
                        <div class="shared-icon">♥</div>
                        <div class="shared-name">{song}</div>
                    </div>
                {/each}
            </div>
        </div>
        
        <div class="recommendations-section">
            <h2>Songs You Might Love</h2>
            <p class="recommendation-intro">Based on {friendName}'s favorites</p>
            
            <div class="recommendations-list">
                {#each recommendations as song}
                    <div class="recommendation-item" style="--album-color: {albumColors[song.album] || '#333'}">
                        <div class="recommendation-album-color"></div>
                        <div class="recommendation-details">
                            <span class="recommendation-title">{song.title}</span>
                            <span class="recommendation-album">{song.album}</span>
                        </div>
                        <button class="listen-button">Listen</button>
                    </div>
                {/each}
            </div>
        </div>
        
        <div class="sharing-section">
            <h2>Share Your Taste Match</h2>
            <div class="sharing-preview">
                <div class="sharing-card">
                    <div class="sharing-header">
                        <h3>Taylor Swift Taste Match</h3>
                        <div class="sharing-percentage">{matchPercentage}%</div>
                    </div>
                    <div class="sharing-users">
                        <div class="sharing-user">
                            <div class="user-avatar">
                                <span>{userName.charAt(0)}</span>
                            </div>
                            <div class="user-albums">
                                {#each userTopAlbums as album}
                                    <span class="mini-album" style="background-color: {albumColors[album] || '#333'}"></span>
                                {/each}
                            </div>
                        </div>
                        <div class="sharing-user">
                            <div class="user-avatar friend-avatar">
                                <span>{friendName.charAt(0)}</span>
                            </div>
                            <div class="user-albums">
                                {#each friendTopAlbums as album}
                                    <span class="mini-album" style="background-color: {albumColors[album] || '#333'}"></span>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sharing-buttons">
                    <button class="share-button instagram">Instagram</button>
                    <button class="share-button twitter">Twitter</button>
                    <button class="share-button facebook">Facebook</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .comparison-container {
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 1000px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .comparison-header {
        background: linear-gradient(135deg, #8CD1E6, #E8C1E1);
        color: white;
        padding: 24px;
        text-align: center;
    }
    
    .comparison-header h1 {
        margin: 0 0 16px;
        font-size: 24px;
    }
    
    .users {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
    }
    
    .user, .friend {
        font-size: 18px;
        font-weight: 500;
    }
    
    .match-indicator {
        background-color: white;
        color: #333;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .match-percentage {
        font-weight: bold;
        font-size: 18px;
    }
    
    .match-label {
        font-size: 12px;
    }
    
    .comparison-content {
        padding: 24px;
    }
    
    .charts-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
    }
    
    .chart-wrapper {
        text-align: center;
    }
    
    .chart-wrapper h3 {
        margin-top: 0;
        margin-bottom: 16px;
    }
    
    .shared-section {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 32px;
    }
    
    .shared-section h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 20px;
        color: #333;
    }
    
    .shared-items {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }
    
    .shared-item {
        display: flex;
        align-items: center;
        background-color: white;
        border-radius: 20px;
        padding: 8px 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .shared-icon {
        color: #E8C1E1;
        margin-right: 8px;
    }
    
    .recommendations-section {
        margin-bottom: 32px;
    }
    
    .recommendations-section h2 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 20px;
        color: #333;
    }
    
    .recommendation-intro {
        margin-top: 0;
        margin-bottom: 16px;
        color: #777;
        font-size: 14px;
    }
    
    .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .recommendation-item {
        display: flex;
        align-items: center;
        background-color: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .recommendation-album-color {
        width: 4px;
        height: 36px;
        background-color: var(--album-color);
        border-radius: 2px;
        margin-right: 12px;
    }
    
    .recommendation-details {
        flex: 1;
    }
    
    .recommendation-title {
        display: block;
        font-weight: 500;
    }
    
    .recommendation-album {
        display: block;
        font-size: 12px;
        color: #777;
    }
    
    .listen-button {
        background-color: #E8C1E1;
        color: white;
        border: none;
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 14px;
        cursor: pointer;
    }
    
    .sharing-section {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
    }
    
    .sharing-section h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 20px;
        color: #333;
    }
    
    .sharing-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
    
    .sharing-card {
        background-color: white;
        border-radius: 12px;
        padding: 16px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .sharing-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .sharing-header h3 {
        margin: 0;
        font-size: 16px;
    }
    
    .sharing-percentage {
        background-color: #E8C1E1;
        color: white;
        border-radius: 16px;
        padding: 4px 12px;
        font-weight: bold;
    }
    
    .sharing-users {
        display: flex;
        justify-content: space-between;
    }
    
    .sharing-user {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
    
    .user-avatar {
        width: 50px;
        height: 50px;
        background-color: #8CD1E6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 20px;
    }
    
    .friend-avatar {
        background-color: #E8C1E1;
    }
    
    .user-albums {
        display: flex;
        gap: 4px;
    }
    
    .mini-album {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        display: inline-block;
    }
    
    .sharing-buttons {
        display: flex;
        gap: 12px;
    }
    
    .share-button {
        padding: 8px 16px;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        color: white;
        cursor: pointer;
    }
    
    .instagram {
        background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    }
    
    .twitter {
        background-color: #1DA1F2;
    }
    
    .facebook {
        background-color: #4267B2;
    }
    
    @media (max-width: 768px) {
        .charts-container {
            grid-template-columns: 1fr;
        }
    }
</style>
