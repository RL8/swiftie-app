<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));">
    <div class="form-container w-full max-w-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        
        <h1 class="form-title text-2xl mb-4">Check Your Email</h1>
        
        <p class="text-gray-600 mb-6">
            We've sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
        </p>
        
        <p class="text-gray-500 text-sm mb-6">
            If you don't see the email, check your spam folder or wait a few minutes.
        </p>
        
        <div class="flex flex-col space-y-3">
            <button 
                onclick={() => goto('/login')}
                class="form-button"
            >
                Go to Login
            </button>
            
            <button 
                onclick={() => goto('/')}
                class="form-button-secondary"
            >
                Return to Home
            </button>
        </div>
    </div>
</div>
