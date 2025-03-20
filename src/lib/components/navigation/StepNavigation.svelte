<script lang="ts">
    /**
     * StepNavigation Component
     * Provides consistent back/forward navigation for multi-step processes
     */
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import Button from '$lib/components/Button/Button.svelte';

    // Props with default values using Svelte 5 syntax
    const {
        backLabel = 'Back',
        backPath = '',
        forwardLabel = 'Next',
        forwardPath = '',
        onBack = null,
        onForward = null,
        disableForward = false,
        showBackButton = true,
        showForwardButton = true,
        currentStep = 0,
        totalSteps = 0,
        showProgressBar = false
    } = $props();

    // Handle back navigation
    function handleBack() {
        if (onBack) {
            onBack();
        } else if (backPath) {
            goto(`${base}${backPath}`);
        }
    }

    // Handle forward navigation
    function handleForward() {
        if (onForward) {
            onForward();
        } else if (forwardPath) {
            goto(`${base}${forwardPath}`);
        }
    }

    // Calculate progress percentage
    const progressPercentage = $derived(
        totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0
    );
</script>

<div class="step-navigation">
    {#if showProgressBar && totalSteps > 0}
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {progressPercentage}%"></div>
            </div>
            <div class="progress-text">Step {currentStep} of {totalSteps}</div>
        </div>
    {/if}
    
    <div class="navigation-container">
        <div class="nav-button-wrapper left">
            {#if showBackButton}
                <Button 
                    variant="outline" 
                    on:click={handleBack}
                    class="back-button"
                >
                    <span class="icon">←</span>
                    <span class="label">{backLabel}</span>
                </Button>
            {/if}
        </div>
        
        <div class="spacer"></div>
        
        <div class="nav-button-wrapper right">
            {#if showForwardButton}
                <Button 
                    variant="primary" 
                    on:click={handleForward}
                    disabled={disableForward}
                    class="forward-button"
                >
                    <span class="label">{forwardLabel}</span>
                    <span class="icon">→</span>
                </Button>
            {/if}
        </div>
    </div>
</div>

<style>
    .step-navigation {
        width: 100%;
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .navigation-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    .spacer {
        flex: 1;
    }
    
    .nav-button-wrapper {
        display: flex;
    }
    
    .nav-button-wrapper.left {
        justify-content: flex-start;
    }
    
    .nav-button-wrapper.right {
        justify-content: flex-end;
    }
    
    :global(.back-button),
    :global(.forward-button) {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .icon {
        font-size: 1.2rem;
    }
    
    .progress-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 0.5rem;
        background-color: #f1f1f1;
        border-radius: 0.25rem;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background-color: rgb(244, 63, 94);
        border-radius: 0.25rem;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        font-size: 0.75rem;
        color: #666;
        text-align: center;
    }
</style>
