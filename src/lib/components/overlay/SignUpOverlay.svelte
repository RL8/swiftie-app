<script lang="ts">
    /**
     * SignUpOverlay Component
     * Displays an overlay encouraging users to sign up for a free account
     */
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import Button from '$lib/components/Button/Button.svelte';

    // Props with default values
    const {
        onDismiss = null
    } = $props();

    // Handle sign up button click
    function handleSignUp() {
        // Navigate to sign up page
        goto(`${base}/signup`);
    }

    // Handle skip button click
    function handleSkip() {
        if (onDismiss) {
            onDismiss();
        }
    }
</script>

<div class="signup-overlay">
    <div class="overlay-backdrop"></div>
    <div class="overlay-content">
        <div class="overlay-icon">🎵</div>
        <h2 class="overlay-title">Wanna keep clowning with us?</h2>
        
        <p class="overlay-description">Get a free account:</p>
        
        <div class="benefits-list">
            <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span>Save your selections</span>
            </div>
            <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span>Unlock more swiftivities</span>
            </div>
            <div class="benefit-item">
                <span class="benefit-icon">✓</span>
                <span>Get your own profile page</span>
            </div>
        </div>
        
        <Button 
            variant="primary" 
            onclick={handleSignUp}
            class="cta-button"
        >
            Sign up - it's free
        </Button>
        
        <button class="skip-link" onclick={handleSkip}>
            Share your selections without signing in
        </button>
    </div>
</div>

<style>
    .signup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        text-align: center;
        z-index: 1000;
        pointer-events: none;
    }
    
    .overlay-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.85);
        pointer-events: auto;
    }
    
    .overlay-content {
        position: relative;
        max-width: 300px;
        background-color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        pointer-events: auto;
        z-index: 1001;
    }
    
    .overlay-icon {
        font-size: 48px;
        margin-bottom: 20px;
        color: #ff1493;
    }
    
    .overlay-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
        color: #333;
    }
    
    .overlay-description {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 16px;
        color: #555;
        font-weight: 500;
    }
    
    .benefits-list {
        text-align: left;
        margin-bottom: 24px;
    }
    
    .benefit-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }
    
    .benefit-icon {
        margin-right: 10px;
        color: #ff1493;
    }
    
    :global(.cta-button) {
        width: 100%;
        margin-bottom: 16px;
        font-weight: bold;
        font-size: 16px;
        padding: 12px 0;
    }
    
    .skip-link {
        background: none;
        border: none;
        font-size: 14px;
        color: #666;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        margin: 0;
    }
</style>
