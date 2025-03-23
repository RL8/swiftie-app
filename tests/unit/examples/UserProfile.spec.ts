import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { safeRender } from '../../helpers';
import UserProfile from '../../../src/lib/components/examples/UserProfile.svelte';
import { writable } from 'svelte/store';

// Mock the user store
vi.mock('../../../src/lib/stores/user', () => {
  const userStore = writable({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg'
  });
  
  return {
    user: userStore,
    updateUserProfile: vi.fn().mockImplementation(async (updates) => {
      userStore.update(user => ({ ...user, ...updates }));
      return { success: true };
    })
  };
});

// Import the mocked store
import { user, updateUserProfile } from '../../../src/lib/stores/user';

describe('UserProfile Component', () => {
  let renderResult;
  
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Render the component
    renderResult = safeRender(UserProfile);
  });
  
  it('should render the user profile information', () => {
    const { getByText, getByAltText } = renderResult;
    
    // Check if user information is displayed
    expect(getByText('Test User')).toBeInTheDocument();
    expect(getByText('test@example.com')).toBeInTheDocument();
    
    // Check if avatar is displayed
    const avatar = getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toContain('https://example.com/avatar.jpg');
  });
  
  it('should allow editing the user name', async () => {
    const { getByText, getByLabelText, getByRole } = renderResult;
    
    // Click the edit button
    const editButton = getByRole('button', { name: /edit/i });
    await fireEvent.click(editButton);
    
    // Edit the name field
    const nameInput = getByLabelText(/name/i);
    await fireEvent.input(nameInput, { target: { value: 'Updated Name' } });
    
    // Save the changes
    const saveButton = getByRole('button', { name: /save/i });
    await fireEvent.click(saveButton);
    
    // Verify the store update function was called
    expect(updateUserProfile).toHaveBeenCalledWith({ name: 'Updated Name' });
    
    // Verify the UI shows the updated name
    expect(getByText('Updated Name')).toBeInTheDocument();
  });
  
  it('should handle profile update errors', async () => {
    // Mock the update function to return an error
    updateUserProfile.mockImplementationOnce(async () => {
      return { success: false, error: 'Failed to update profile' };
    });
    
    const { getByText, getByLabelText, getByRole } = renderResult;
    
    // Click the edit button
    const editButton = getByRole('button', { name: /edit/i });
    await fireEvent.click(editButton);
    
    // Edit the name field
    const nameInput = getByLabelText(/name/i);
    await fireEvent.input(nameInput, { target: { value: 'Updated Name' } });
    
    // Save the changes
    const saveButton = getByRole('button', { name: /save/i });
    await fireEvent.click(saveButton);
    
    // Verify the error message is displayed
    expect(getByText('Failed to update profile')).toBeInTheDocument();
  });
  
  it('should cancel editing without saving changes', async () => {
    const { getByText, getByLabelText, getByRole } = renderResult;
    
    // Get the original name
    const originalName = 'Test User';
    expect(getByText(originalName)).toBeInTheDocument();
    
    // Click the edit button
    const editButton = getByRole('button', { name: /edit/i });
    await fireEvent.click(editButton);
    
    // Edit the name field
    const nameInput = getByLabelText(/name/i);
    await fireEvent.input(nameInput, { target: { value: 'Temporary Name' } });
    
    // Cancel the changes
    const cancelButton = getByRole('button', { name: /cancel/i });
    await fireEvent.click(cancelButton);
    
    // Verify the update function was not called
    expect(updateUserProfile).not.toHaveBeenCalled();
    
    // Verify the UI still shows the original name
    expect(getByText(originalName)).toBeInTheDocument();
  });
});
