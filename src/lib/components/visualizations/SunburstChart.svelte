<script lang="ts">
    import { onMount } from 'svelte';
    
    // Define a type for the data structure
    type SunburstNode = {
        name: string;
        value?: number;
        children?: SunburstNode[];
    };
    
    export let data: SunburstNode = { name: "Root" }; // Now properly typed and used
    export let title = 'Music Preferences';
    export let width = '100%';
    export let height = '400px';
    export let colorPalette = [
        'var(--color-primary)',
        'var(--color-primary-light)',
        'var(--color-primary-dark)',
        'var(--color-primary-alpha)',
        'var(--color-secondary)',
        'var(--color-secondary-light)',
        'var(--color-secondary-dark)'
    ];
    
    let container: HTMLDivElement;
    
    onMount(() => {
        // This would be replaced with actual chart rendering code
        // using AnyChart, D3.js, or another library
        const mockRender = () => {
            if (container) {
                // Use the data prop to display the chart title with the root node name
                const chartTitle = `${title}: ${data.name}`;
                
                container.innerHTML = `
                    <div style="width: ${width}; height: ${height}; display: flex; align-items: center; justify-content: center; flex-direction: column; color: var(--text-primary);">
                        <h3 style="margin-bottom: 10px; color: var(--text-primary);">${chartTitle}</h3>
                        <div style="width: 300px; height: 300px; border-radius: 50%; background: conic-gradient(
                            ${colorPalette[0]} 0% 15%, 
                            ${colorPalette[1]} 15% 30%, 
                            ${colorPalette[2]} 30% 45%, 
                            ${colorPalette[3]} 45% 60%, 
                            ${colorPalette[4]} 60% 75%, 
                            ${colorPalette[5]} 75% 90%, 
                            ${colorPalette[6]} 90% 100%
                        ); position: relative; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-primary);">
                            <div style="width: 150px; height: 150px; border-radius: 50%; background: var(--bg-container); display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 14px; text-align: center; color: var(--text-primary);">${data.name}<br>Chart</span>
                            </div>
                        </div>
                    </div>
                `;
            }
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
        background-color: var(--bg-container);
        border-radius: var(--radius-card);
        padding: var(--space-4);
        box-shadow: var(--shadow-sm);
    }
</style>
