<script lang="ts">
    import BaseHeader from './BaseHeader.svelte';
    
    export let title: string;
    export let subtitle: string = '';
    export let progress: number = 0;
    export let maxProgress: number = 3;
</script>

<BaseHeader {title} {subtitle} headerSlot={true}>
    <div slot="header" class="progress-bar">
        <div class="progress-segments">
            {#each Array(maxProgress) as _, i}
                <div class="segment" class:filled={i < progress}>
                    {#if i < progress}
                        <div class="segment-number">{i + 1}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</BaseHeader>

<style>
    .progress-bar {
        margin-top: var(--spacing-content);
    }

    .progress-segments {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: rgb(254, 205, 211);
        border-radius: 9999px;
        padding: 1px;
    }

    .segment {
        height: 8px;
        background: white;
        border-radius: 9999px;
        position: relative;
        transition: background-color var(--duration-fast) var(--timing-function);
    }

    .segment.filled {
        background: var(--color-primary);
    }

    .segment-number {
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 14px;
        color: var(--color-primary);
        font-weight: 600;
    }
</style>
