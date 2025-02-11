<script lang="ts">
    export let sticky = false;
</script>

<footer class="page-footer" class:sticky>
    <div class="max-w-md mx-auto px-4">
        <slot />
    </div>
</footer>

<style>
    .page-footer {
        @apply w-full bg-white/60 backdrop-blur-sm border-t border-rose-100 py-6;
    }

    .sticky {
        position: sticky;
        bottom: 0;
        z-index: 10;
    }
</style>
