<script lang="ts">
    import type { HeaderProps } from '$lib/types/components';
    
    interface Props {
        variant?: HeaderProps['variant'];
        title: string;
        subtitle?: string | undefined;
        progress?: number | undefined;
        maxProgress?: number | undefined;
        left?: import('svelte').Snippet;
    }

    let {
        variant = 'base',
        title,
        subtitle = undefined,
        progress = undefined,
        maxProgress = undefined,
        left
    }: Props = $props();
</script>

<div class="header {variant}">
    {#if variant === "progress"}
        <div class="progress-header">
            <div class="left-content">
                {@render left?.()}
            </div>
            <div class="center-content">
                <h1>{title}</h1>
                {#if subtitle}
                    <p>{subtitle}</p>
                {/if}
                <div class="progress-dots">
                    {#each Array(maxProgress) as _, i}
                        <div class="dot" class:active={i < progress}></div>
                    {/each}
                </div>
            </div>
            <div class="right-content">
                <!-- Reserved for future use -->
            </div>
        </div>
    {:else}
        <h1>{title}</h1>
        {#if subtitle}
            <p>{subtitle}</p>
        {/if}
    {/if}
</div>

<style>
    .header {
        padding: 1rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .progress-header {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;
    }

    .left-content, .right-content {
        display: flex;
        align-items: center;
    }

    .center-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    h1 {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-primary);
    }

    p {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .progress-dots {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.25rem;
    }

    .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease-out;
    }

    .dot.active {
        background: rgb(244, 63, 94);
    }
</style>
