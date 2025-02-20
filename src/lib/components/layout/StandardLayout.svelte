<script lang="ts">
    import { run } from 'svelte/legacy';

    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    interface Props {
        showHeader?: boolean;
        showFooter?: boolean;
        customGradient?: string;
        hasFooterNav?: boolean;
        header?: import('svelte').Snippet;
        main?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
        footer?: import('svelte').Snippet;
    }

    let {
        showHeader = true,
        showFooter = true,
        customGradient = 'bg-gradient-to-br from-rose-50 to-rose-100',
        hasFooterNav = $bindable(false),
        header,
        main,
        children,
        footer
    }: Props = $props();
    
    let footerSlot: HTMLElement = $state();
    
    function checkFooterNav() {
        if (footerSlot) {
            // Check for any interactive elements that could be navigation
            const hasNavElements = footerSlot.querySelector('nav, button, a, [role="button"]') !== null;
            hasFooterNav = hasNavElements;
        }
    }
    
    run(() => {
        if (footerSlot) {
            checkFooterNav();
        }
    });
    
    onMount(() => {
        checkFooterNav();
    });
</script>

<div class="fixed inset-0 bg-slate-200 flex justify-center items-center p-4">
    <div class="app-frame {customGradient} flex flex-col w-full max-w-md h-[800px] rounded-3xl overflow-hidden shadow-2xl">
        {#if showHeader}
            {@render header?.()}
        {/if}

        <div class="flex-1 overflow-y-auto relative scrollbar-taylor">
            {#if main}{@render main()}{:else}
                {@render children?.()}
            {/if}
        </div>

        {#if showFooter}
            <footer bind:this={footerSlot}>
                {@render footer?.()}
            </footer>
        {/if}
    </div>
</div>

<style>
    :global(.app-frame) {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    :global(.app-frame > *) {
        position: relative;
        z-index: 1;
    }
</style>
