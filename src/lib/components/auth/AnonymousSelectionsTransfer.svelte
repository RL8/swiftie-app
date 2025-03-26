<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { supabase } from '$lib/supabase/client';
    import { anonymousSelections } from '$lib/stores/anonymousSelections';
    import { transferAnonymousSelections } from '$lib/services/database';
    
    // Status states
    let transferStatus = $state('idle'); // 'idle', 'transferring', 'success', 'error'
    let errorMessage = $state('');
    
    // Check for and handle the transfer cookie
    function getCookie(name: string): string | null {
        if (!browser) return null;
        
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }
    
    // Delete the transfer cookie
    function deleteCookie(name: string): void {
        if (!browser) return;
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    
    // Handle the transfer process
    async function handleTransfer() {
        try {
            transferStatus = 'transferring';
            
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                transferStatus = 'error';
                errorMessage = 'No authenticated user found';
                return;
            }
            
            // Get all anonymous selections
            const selections = anonymousSelections.exportSelections();
            
            // If no selections, mark as success and return
            if (!selections || selections.length === 0) {
                transferStatus = 'success';
                return;
            }
            
            // Transfer the selections to the user's account
            const result = await transferAnonymousSelections(user.id, selections);
            
            if (result.success) {
                // Clear anonymous selections after successful transfer
                anonymousSelections.clearSelections();
                transferStatus = 'success';
            } else {
                transferStatus = 'error';
                errorMessage = result.error || 'Unknown error transferring selections';
            }
        } catch (error) {
            transferStatus = 'error';
            errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error transferring anonymous selections:', error);
        } finally {
            // Always delete the cookie to prevent repeated transfers
            deleteCookie('transfer_anonymous_selections');
        }
    }
    
    onMount(() => {
        // Check if we should transfer anonymous selections
        const shouldTransfer = getCookie('transfer_anonymous_selections') === 'true';
        
        if (shouldTransfer) {
            // Start the transfer process
            handleTransfer();
        }
    });
</script>

{#if transferStatus === 'transferring'}
    <!-- Optional: Show a loading indicator while transferring -->
    <div class="hidden">Transferring your selections...</div>
{/if}

{#if transferStatus === 'error'}
    <!-- Optional: Show an error message if transfer fails -->
    <div class="hidden">Error transferring selections: {errorMessage}</div>
{/if}
