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

        <main class="flex-1 overflow-y-auto">
            <slot />
        </main>

        {#if showFooter}
            <slot name="footer" />
        {/if}
    </div>
</div>

<style>
    main {
        z-index: var(--z-content);
    }
</style>
