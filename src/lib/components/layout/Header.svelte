<script lang="ts">
    import type { HeaderProps } from '$lib/types/components';
    
    export let variant: HeaderProps['variant'] = 'base';
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let progress: number | undefined = undefined;
    export let maxProgress: number | undefined = undefined;
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
            <div class="progress-chevrons">
                {#each Array(maxProgress) as _, i}
                    <div class="chevron {i < progress ? 'filled' : ''}">
                        <span class="chevron-number">{i + 1}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</header>

<style>
    .header {
        padding: var(--spacing-header);
        background: var(--bg-header);
        backdrop-filter: var(--blur-sm);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: var(--header-height);
    }

    .header-content {
        max-width: 20rem;
    }

    .title {
        font-size: clamp(1.25rem, 3vh, 1.5rem);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
    }

    .subtitle {
        font-size: clamp(0.875rem, 2.25vh, 1rem);
        color: var(--text-secondary);
        margin: var(--dynamic-spacing-xs) 0 0;
    }

    .progress-bar {
        margin-top: var(--dynamic-spacing-sm);
        width: 100%;
        max-width: 24rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        backdrop-filter: blur(8px);
    }

    .progress-chevrons {
        display: flex;
        justify-content: center;
        gap: 0;
        margin-top: 0;
        width: 100%;
        max-width: 24rem;
        margin-left: auto;
        margin-right: auto;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .chevron {
        width: 9rem;
        height: 3rem;
        background: rgba(244, 63, 94, 0.3);
        clip-path: polygon(85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%, 0% 0%);
        margin: 0 0.000625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
    }

    .chevron.filled {
        background: rgb(244, 63, 94);
        filter: drop-shadow(0 2px 8px rgba(244, 63, 94, 0.3));
    }

    .chevron-number {
        color: white;
        font-size: 1.25rem;
        font-weight: 500;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        opacity: 0.7;
        transition: all 0.3s ease;
    }

    .filled .chevron-number {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05);
    }

    @keyframes appear {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(1);
        }
    }
</style>
