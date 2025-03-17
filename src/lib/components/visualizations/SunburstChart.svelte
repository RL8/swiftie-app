<script lang="ts">
    import { onMount } from 'svelte';
    
    export let data = {};
    export let title = 'Music Preferences';
    export let width = '100%';
    export let height = '400px';
    export let colorPalette = [
        '#dbaaff', '#ff9a32', '#69d55e', '#ff8470', '#80c3ff',
        '#355a85', '#66a64a', '#fab353', '#aaa2d8', '#6097ce'
    ];
    
    let container;
    
    onMount(() => {
        // This would be replaced with actual chart rendering code
        // using AnyChart, D3.js, or another library
        const mockRender = () => {
            container.innerHTML = `
                <div style="width: ${width}; height: ${height}; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #333;">
                    <h3 style="margin-bottom: 10px;">${title}</h3>
                    <div style="width: 300px; height: 300px; border-radius: 50%; background: conic-gradient(
                        ${colorPalette[0]} 0% 15%, 
                        ${colorPalette[1]} 15% 30%, 
                        ${colorPalette[2]} 30% 45%, 
                        ${colorPalette[3]} 45% 60%, 
                        ${colorPalette[4]} 60% 75%, 
                        ${colorPalette[5]} 75% 90%, 
                        ${colorPalette[6]} 90% 100%
                    ); position: relative; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 150px; height: 150px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 14px; text-align: center;">Interactive<br>Sunburst Chart</span>
                        </div>
                    </div>
                </div>
            `;
        };
        
        mockRender();
    });
</script>

<div bind:this={container} class="sunburst-container"></div>

<style>
    .sunburst-container {
        width: 100%;
        height: 100%;
        min-height: 400px;
    }
</style>
