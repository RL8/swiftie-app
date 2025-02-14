<script lang="ts">
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import BaseHeader from '$lib/components/layout/HeaderVariants/BaseHeader.svelte';
    import ButtonFooter from '$lib/components/layout/FooterVariants/ButtonFooter.svelte';
    import Button from '$lib/components/Button/Button.svelte';
</script>

<StandardLayout>
    <BaseHeader 
        slot="header"
        title="Page Not Found"
        subtitle="Oops! Looks like we're in a blank space"
    />

    <div class="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div class="text-6xl mb-4">🎵</div>
        <p class="text-rose-700 mb-8">
            The page you're looking for seems to have disappeared like a cruel summer.
        </p>
        <a href="{base}/" class="button-primary">
            Back to Home
        </a>
    </div>
</StandardLayout>
