<script lang="ts">
    import { page } from '$app/stores';
    
    export let showHeader = true;
    export let showFooter = true;
    export let customGradient = 'bg-gradient-to-br from-rose-50 to-rose-100';
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
            <slot name="footer" />
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
