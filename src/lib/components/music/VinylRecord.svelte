<!-- VinylRecord.svelte -->
<script lang="ts">
    /** The source URL for the album cover art */
    export let coverArt: string;
    /** The album title for alt text */
    export let title: string;
    /** Whether the record is currently selected */
    export let selected: boolean = false;
    /** The selection number (1-3) to show when selected */
    export let selectionNumber: number | null = null;
    /** Whether to animate the record */
    export let animate: boolean = true;
    /** Custom CSS class to apply to the container */
    export let class_: string = '';
    /** Position of the heart badge. Can be 'image', 'container', or 'none' */
    export let badgePosition: 'image' | 'container' | 'none' = 'image';
    /** Whether to show the selection overlay when selected */
    export let showSelectionOverlay: boolean = true;
    /** Whether to show the vinyl grooves effect */
    export let showGrooves: boolean = true;
    /** Configuration for the vinyl record's visual appearance */
    export let config: {
        /** The color of the vinyl record's center */
        centerColor: string;
        /** The color of the vinyl record's grooves */
        grooveColor: string;
        /** The color of the selection overlay */
        selectionColor: string;
        /** The color of the heart badge */
        badgeColor: string;
    } = {
        centerColor: 'rgba(0, 0, 0, 0.8)',
        grooveColor: 'rgba(255, 255, 255, 0.05)',
        selectionColor: 'rgba(244, 63, 94, 0.2)',
        badgeColor: 'rgb(244, 63, 94)',
    };

    // Random initial rotation for subtle animation
    const randomRotation = Math.random() * 5 - 2.5;
</script>

<div
    class="vinyl-container {class_}"
    class:selected
    style="--random-rotation: {randomRotation};"
    on:click
    on:keydown
>
    {#if selected && selectionNumber !== null && badgePosition === 'container'}
        <div class="heart-badge container-badge">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={config.badgeColor} class="heart-icon">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span class="heart-number">
                {selectionNumber}
            </span>
        </div>
    {/if}
    <div class="vinyl">
        <img
            src={coverArt}
            {title}
            class="vinyl-art"
            alt={title}
        />
        {#if showGrooves}
            <div class="vinyl-grooves" style={`background: repeating-radial-gradient(circle at center, transparent 0, transparent 3px, ${config.grooveColor} 3.5px, rgba(0, 0, 0, 0.15) 4px)`}></div>
        {/if}
        <div class="vinyl-center" style={`background: radial-gradient(circle at center, ${config.centerColor} 0%, rgba(0, 0, 0, 0.9) 50%, #000 100%)`}></div>
        {#if selected && selectionNumber !== null && badgePosition === 'image'}
            <div class="heart-badge image-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={config.badgeColor} class="heart-icon">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                <span class="heart-number">
                    {selectionNumber}
                </span>
            </div>
        {/if}
        {#if selected && showSelectionOverlay}
            <div class="selection-overlay" style={`background: ${config.selectionColor}`}></div>
        {/if}
    </div>
</div>

<style>
    .vinyl-container {
        aspect-ratio: 1;
        position: relative;
        transform: rotate(calc(var(--random-rotation, 0) * 1deg));
        transition: all 0.3s ease-out;
    }

    .vinyl-container:not(.selected) {
        animation: subtleRotate 2s ease-in-out infinite;
    }

    .vinyl-container.selected {
        z-index: 20;
        animation: fullRotate 8s linear infinite;
    }

    @keyframes fullRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes subtleRotate {
        0% { transform: rotate(calc(var(--random-rotation, 0) * 1deg)); }
        50% { transform: rotate(calc((var(--random-rotation, 0) + 2) * 1deg)); }
        100% { transform: rotate(calc(var(--random-rotation, 0) * 1deg)); }
    }

    .vinyl {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: #000;
        overflow: hidden;
        box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    .vinyl-art {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .vinyl-grooves {
        position: absolute;
        inset: 0;
        mix-blend-mode: overlay;
        z-index: 2;
        pointer-events: none;
        opacity: 0.85;
    }

    .vinyl-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20%;
        height: 20%;
        border-radius: 50%;
        z-index: 4;
        box-shadow: 
            0 0 0 2px rgba(255, 255, 255, 0.1),
            inset 0 0 0 2px rgba(0, 0, 0, 0.4);
    }

    .vinyl-center::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 15%;
        height: 15%;
        background: rgb(226, 232, 240);
        border-radius: 50%;
        box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.2);
    }

    .selection-overlay {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        z-index: 3;
        box-shadow: inset 0 0 20px rgba(244, 63, 94, 0.4);
    }

    .heart-badge {
        position: absolute;
        width: 3.6rem;
        height: 3.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 30;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        pointer-events: none;
    }

    .heart-badge.image-badge {
        top: -0.4rem;
        left: -0.4rem;
        animation: noRotate 8s linear infinite reverse;
    }

    .heart-badge.container-badge {
        top: -1rem;
        left: -1rem;
    }

    @keyframes noRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .heart-icon {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .heart-number {
        position: relative;
        color: white;
        font-weight: bold;
        font-size: 1.25rem;
        z-index: 11;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
</style>
