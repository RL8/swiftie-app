<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    export let showHeader = true;
    export let showFooter = true;
    export let customGradient = 'bg-gradient-to-br from-rose-50 to-rose-100';
    export let hasFooterNav = false;
    
    let footerSlot: HTMLElement;
    
    function checkFooterNav() {
        if (footerSlot) {
            // Check for any interactive elements that could be navigation
            const hasNavElements = footerSlot.querySelector('nav, button, a, [role="button"]') !== null;
            hasFooterNav = hasNavElements;
        }
    }
    
    $: if (footerSlot) {
        checkFooterNav();
    }
    
    onMount(() => {
        checkFooterNav();
    });
</script>

<div class="fixed inset-0 bg-slate-200 flex justify-center items-center p-4">
    <div class="app-frame {customGradient} flex flex-col w-full max-w-md h-[800px] rounded-3xl overflow-hidden shadow-2xl">
        {#if showHeader}
            <slot name="header" />
        {/if}

        <div class="flex-1 overflow-y-auto relative scrollbar-taylor">
            <slot name="main">
                <slot />
            </slot>
        </div>

        {#if showFooter}
            <footer bind:this={footerSlot}>
                <slot name="footer" />
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
