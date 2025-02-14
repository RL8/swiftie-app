<script>
    import '../styles/tokens/index.css';
    import { page } from '$app/stores';
    
    $: isHomePage = $page.url.pathname === '/';
</script>

<div class="min-h-full bg-slate-50/50 p-4 flex items-stretch">
    <div class="mobile-container {isHomePage ? 'home-page' : ''}">
        <div class="app-frame">
            <slot />
        </div>
    </div>
</div>

<style>
    .mobile-container {
        width: 100%;
        max-width: 28rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .app-frame {
        background: rgb(255 255 255 / 0.9);
        border-radius: 2rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .home-page .app-frame {
        background: transparent;
        box-shadow: none;
    }
</style>
