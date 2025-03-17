<script>
    import { onMount } from 'svelte';
    import { 
        getCurrentVersion,
        getAvailableVersions,
        createVersionBadge,
        createVersionLink,
        createVersionSelector,
        openVersionControl
    } from '$lib/docsIntegration.js';
    
    // Use $state for Svelte 5 compatibility (runes mode)
    let $activeVersion = null;
    let $versions = [];
    
    // Load version data on mount
    onMount(() => {
        $activeVersion = getCurrentVersion();
        $versions = getAvailableVersions();
    });
    
    // Handle version change
    function handleVersionChange(versionId) {
        $activeVersion = $versions.find(v => v.id === versionId) || $activeVersion;
    }
    
    // Open version control documentation
    function viewVersionDocs() {
        openVersionControl($activeVersion?.id);
    }
</script>

<div class="version-control-demo">
    <div class="version-info-box">
        <h3>Version Control Demo</h3>
        
        {#if $activeVersion}
            <p>
                Current app version: 
                <strong>{$activeVersion.name}</strong>
                <span class="version-pill">{$activeVersion.id}</span>
                <span class="release-date">Released: {$activeVersion.releaseDate}</span>
            </p>
        {/if}
        
        <div class="controls">
            <div class="select-container">
                <label for="version-select">Select Version:</label>
                <select 
                    id="version-select" 
                    class="version-selector" 
                    on:change={(e) => handleVersionChange(e.target.value)}
                    value={$activeVersion?.id}
                >
                    {#each $versions as version}
                        <option value={version.id}>
                            {version.name} ({version.releaseDate})
                        </option>
                    {/each}
                </select>
            </div>
            
            <button class="view-docs-btn" on:click={viewVersionDocs}>
                View Version Documentation
            </button>
        </div>
        
        <div class="version-timeline">
            <h4>Version History</h4>
            {#each $versions as version}
                <div class="timeline-item">
                    <span class="version-dot"></span>
                    <div class="timeline-content">
                        <div class="version-header">
                            <span class="version-name">{version.name}</span>
                            <span class="version-id">{version.id}</span>
                        </div>
                        <span class="version-date">{version.releaseDate}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .version-control-demo {
        margin: 2rem 0;
    }
    
    .version-info-box {
        background-color: #f8f9fa;
        border: 1px solid #dddddd;
        border-radius: 0.5rem;
        padding: 1.5rem;
    }
    
    h3 {
        margin-top: 0;
        color: #ff83a6;
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }
    
    h4 {
        color: #555;
        margin: 1.5rem 0 1rem;
        font-size: 1.1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
    }
    
    .version-pill {
        display: inline-block;
        background-color: #ff83a6;
        color: white;
        font-size: 0.8rem;
        font-weight: bold;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        margin-left: 0.5rem;
    }
    
    .release-date {
        color: #666;
        font-size: 0.9rem;
        margin-left: 0.5rem;
    }
    
    .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1.5rem 0;
        align-items: flex-end;
    }
    
    .select-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    label {
        font-size: 0.9rem;
        color: #555;
    }
    
    .version-selector {
        padding: 0.5rem;
        border: 1px solid #dddddd;
        border-radius: 0.25rem;
        min-width: 250px;
    }
    
    .view-docs-btn {
        padding: 0.5rem 1rem;
        background-color: #ff83a6;
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-weight: bold;
    }
    
    .view-docs-btn:hover {
        background-color: #ff6b96;
    }
    
    .version-timeline {
        position: relative;
        margin: 2rem 0 1rem;
        padding-left: 1.5rem;
    }
    
    .version-timeline:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0.5rem;
        width: 2px;
        height: 100%;
        background-color: #ddd;
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 1.5rem;
        padding-left: 1rem;
    }
    
    .version-dot {
        position: absolute;
        left: -1.5rem;
        top: 0.25rem;
        width: 1rem;
        height: 1rem;
        background-color: #ff83a6;
        border-radius: 50%;
        z-index: 2;
    }
    
    .timeline-content {
        background-color: #fff;
        padding: 0.75rem;
        border-radius: 0.25rem;
        border: 1px solid #eee;
    }
    
    .version-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
    }
    
    .version-name {
        font-weight: bold;
        color: #333;
    }
    
    .version-id {
        color: #ff83a6;
        font-weight: bold;
    }
    
    .version-date {
        color: #666;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .controls {
            flex-direction: column;
            align-items: stretch;
        }
    }
</style>
