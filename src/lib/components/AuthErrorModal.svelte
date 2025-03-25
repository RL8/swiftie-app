<script>
  export let error = null;
  export let onClose = () => {};
  export let onRetry = () => {};
  
  let visible = true;
  
  function close() {
    visible = false;
    onClose();
  }
  
  function retry() {
    onRetry();
    close();
  }
</script>

{#if visible && error}
  <div class="auth-error-modal-backdrop">
    <div class="auth-error-modal">
      <div class="auth-error-modal-header">
        <h2>Authentication Error</h2>
        <button class="close-btn" onclick={close}>×</button>
      </div>
      
      <div class="auth-error-modal-body">
        <div class="error-icon">⚠️</div>
        <h3>{error.type ? error.type.replace(/_/g, ' ') : 'Authentication Error'}</h3>
        <p>{error.message || 'There was a problem with your authentication'}</p>
        
        {#if error.details}
          <div class="error-details">
            <h4>Details:</h4>
            <ul>
              {#each Object.entries(error.details) as [key, value]}
                <li><strong>{key}:</strong> {value}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
      
      <div class="auth-error-modal-footer">
        <button class="retry-btn" onclick={retry}>Try Again</button>
        <button class="close-btn-secondary" onclick={close}>Dismiss</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .auth-error-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .auth-error-modal {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .auth-error-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f8d7da;
    color: #721c24;
    border-bottom: 1px solid #f5c6cb;
  }
  
  .auth-error-modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #721c24;
  }
  
  .auth-error-modal-body {
    padding: 1.5rem;
    text-align: center;
  }
  
  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .auth-error-modal-body h3 {
    margin: 0 0 1rem;
    text-transform: capitalize;
    color: #721c24;
  }
  
  .auth-error-modal-body p {
    margin: 0 0 1rem;
    color: #555;
  }
  
  .error-details {
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
    text-align: left;
  }
  
  .error-details h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #555;
  }
  
  .error-details ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  .error-details li {
    margin-bottom: 0.25rem;
  }
  
  .auth-error-modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
  }
  
  .retry-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    cursor: pointer;
  }
  
  .retry-btn:hover {
    background-color: #c82333;
  }
  
  .close-btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .close-btn-secondary:hover {
    background-color: #5a6268;
  }
</style>
