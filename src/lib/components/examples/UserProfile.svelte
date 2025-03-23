<script>
  import { user, updateUserProfile } from '$lib/stores/user';
  
  let isEditing = false;
  let editedUser = { ...$user };
  let errorMessage = '';
  
  function startEditing() {
    editedUser = { ...$user };
    isEditing = true;
    errorMessage = '';
  }
  
  function cancelEditing() {
    isEditing = false;
    errorMessage = '';
  }
  
  async function saveChanges() {
    const result = await updateUserProfile(editedUser);
    
    if (result.success) {
      isEditing = false;
      errorMessage = '';
    } else {
      errorMessage = result.error;
    }
  }
</script>

<div class="user-profile">
  {#if isEditing}
    <form on:submit|preventDefault={saveChanges} class="edit-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          id="name" 
          type="text" 
          bind:value={editedUser.name} 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          value={editedUser.email} 
          disabled
        />
      </div>
      
      <div class="form-actions">
        <button type="button" on:click={cancelEditing}>Cancel</button>
        <button type="submit">Save</button>
      </div>
      
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
    </form>
  {:else}
    <div class="profile-info">
      <img 
        src={$user.avatar_url} 
        alt="User avatar" 
        class="avatar"
      />
      
      <div class="user-details">
        <h2>{$user.name}</h2>
        <p>{$user.email}</p>
      </div>
      
      <button on:click={startEditing} class="edit-button">Edit</button>
    </div>
  {/if}
</div>

<style>
  .user-profile {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-details {
    flex-grow: 1;
  }
  
  .user-details h2 {
    margin: 0 0 5px 0;
    font-size: 1.5rem;
  }
  
  .user-details p {
    margin: 0;
    color: #666;
  }
  
  .edit-button {
    padding: 8px 16px;
    background-color: #4a56e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .form-group label {
    font-weight: 600;
  }
  
  .form-group input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
  }
  
  .form-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .form-actions button[type="button"] {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .form-actions button[type="submit"] {
    background-color: #4a56e2;
    color: white;
  }
  
  .error-message {
    color: #e74c3c;
    margin-top: 10px;
    padding: 10px;
    background-color: #fdedeb;
    border-radius: 4px;
  }
</style>
