<script lang="ts">
    import { getContextPlaceholderMessage } from '$lib/utils/context-helpers';
    import { fade } from 'svelte/transition';

    // Props
    const { contextName, actionUrl, actionText, customMessage } = $props<{
        contextName: string;
        actionUrl?: string;
        actionText?: string;
        customMessage?: string;
    }>();

    // Derive the message to display using proper runes syntax
    const message = $derived(customMessage || getContextPlaceholderMessage(contextName));
</script>

<div class="context-placeholder" transition:fade={{ duration: 300 }}>
    <div class="placeholder-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{message}</p>
        {#if actionUrl && actionText}
            <a href={actionUrl} class="action-button">{actionText}</a>
        {/if}
    </div>
</div>

<style>
    .context-placeholder {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .placeholder-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.5rem;
    }

    .icon {
        color: #7c3aed;
        margin-bottom: 0.5rem;
    }

    p {
        margin: 0;
        color: #4b5563;
        font-size: 0.95rem;
    }

    .action-button {
        margin-top: 0.5rem;
        display: inline-block;
        background-color: #7c3aed;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .action-button:hover {
        background-color: #6d28d9;
    }
</style>
