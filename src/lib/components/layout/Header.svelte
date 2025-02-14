<script lang="ts">
    import type { HeaderProps } from '$lib/types/components';
    
    export let title: HeaderProps['title'];
    export let subtitle: HeaderProps['subtitle'] = '';
    export let variant: HeaderProps['variant'] = 'base';
    export let progress: HeaderProps['progress'] = 0;
    export let maxProgress: HeaderProps['maxProgress'] = 3;
</script>

<header class="header" class:with-progress={variant === 'progress'}>
    <div class="header-content">
        <h1 class="title">{title}</h1>
        {#if subtitle}
            <p class="subtitle">{subtitle}</p>
        {/if}
    </div>
    {#if variant === 'progress'}
        <div class="progress-bar">
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
    {/if}
    <slot name="header" />
</header>

<style>
    .header {
        padding: var(--spacing-header);
        background: var(--bg-header);
        backdrop-filter: var(--blur-sm);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .title {
        font-size: clamp(1rem, 2.5vh, 1.25rem);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .subtitle {
        font-size: clamp(0.75rem, 2vh, 0.875rem);
        color: var(--text-secondary);
        margin: var(--dynamic-spacing-xs) 0 0;
    }

    .progress-bar {
        margin-top: var(--dynamic-spacing-xs);
    }

    .progress-segments {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        background: var(--bg-container);
        height: clamp(1.25rem, 3vh, 1.5rem);
        border-radius: var(--radius-full);
        overflow: hidden;
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
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--color-primary);
    }
</style>
