<script lang="ts">
    import { base } from '$app/paths';
    import StandardLayout from '$lib/components/layout/StandardLayout.svelte';
    import Header from '$lib/components/layout/Header.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Button from '$lib/components/Button/Button.svelte';
</script>

<StandardLayout>
    {#snippet header()}
        <Header 
            
            title="Page Not Found"
            subtitle="Sorry, we couldn't find what you're looking for"
        />
    {/snippet}

    <div class="flex flex-col items-center justify-center flex-1 p-4 text-center">
        <div class="text-6xl mb-4">🎵</div>
        <p class="text-rose-700 mb-8">
            The page you're looking for seems to have disappeared like a cruel summer.
        </p>
    </div>

    {#snippet footer()}
        <Footer variant="button" >
            <Button variant="primary" on:click={() => goto(base)}>
                Go Home
            </Button>
        </Footer>
    {/snippet}
</StandardLayout>
