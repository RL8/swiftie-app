<script>
    import { base } from '$app/paths';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 class="text-4xl font-bold mb-4">Page Not Found</h1>
    <p class="mb-8">Oops! The page you're looking for doesn't exist.</p>
    <a 
        href="{base}/" 
        class="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
    >
        Go Home
    </a>
</div>
