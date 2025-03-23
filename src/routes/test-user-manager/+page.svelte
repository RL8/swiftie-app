<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabase/client';

    let testUsers = [];
    let loading = false;
    let error = null;
    let errorDetails = null;
    let success = null;
    let createdUser = null;
    let sessionInfo = null;
    let loginStatus = null;
    let loginError = null;

    // Load test users on mount
    onMount(async () => {
        await loadTestUsers();
        await checkSession();
    });

    // Function to check current session
    async function checkSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                sessionInfo = { error: error.message };
            } else {
                sessionInfo = data;
                console.log('Current session:', data);
            }
        } catch (err) {
            console.error('Exception checking session:', err);
            sessionInfo = { error: err.message };
        }
    }

    // Function to login with test user credentials
    async function loginWithTestUser() {
        if (!createdUser) {
            loginError = 'No test user credentials available';
            return;
        }

        loginStatus = 'Logging in...';
        loginError = null;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: createdUser.email,
                password: createdUser.password
            });
            
            if (error) {
                loginError = error.message;
                loginStatus = 'Login failed';
                console.error('Login error:', error);
            } else {
                loginStatus = 'Login successful!';
                console.log('Login successful:', data);
                
                // Update session info
                await checkSession();
                
                // Wait a moment to ensure session is established
                setTimeout(() => {
                    goto('/feed');
                }, 1000);
            }
        } catch (err) {
            loginError = err.message;
            loginStatus = 'Login failed';
            console.error('Exception during login:', err);
        }
    }

    // Function to load test users
    async function loadTestUsers() {
        loading = true;
        error = null;
        errorDetails = null;
        
        try {
            const response = await fetch('/api/create-test-user');
            const data = await response.json();
            
            if (data.error) {
                error = data.error;
                testUsers = [];
            } else {
                testUsers = data.users || [];
            }
        } catch (err) {
            error = err.message;
            testUsers = [];
        } finally {
            loading = false;
        }
    }

    // Function to create a test user
    async function createTestUser() {
        loading = true;
        error = null;
        errorDetails = null;
        success = null;
        createdUser = null;
        
        try {
            const response = await fetch('/api/create-test-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})  // Using default values from the API
            });
            
            const data = await response.json();
            
            if (!data.success) {
                error = data.message || 'Failed to create test user';
                errorDetails = data.errorDetails;
                console.error('Error creating test user:', data.error);
                console.error('Error details:', data.errorDetails);
            } else {
                success = data.message;
                createdUser = data.loginCredentials;
                await loadTestUsers();  // Refresh the list
            }
        } catch (err) {
            error = err.message;
            console.error('Exception caught:', err);
        } finally {
            loading = false;
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
</script>

<div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-2xl font-bold mb-6">Test User Manager</h1>
    
    <!-- Error and Success Messages -->
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p class="font-bold">Error: {error}</p>
            
            {#if errorDetails}
                <div class="mt-2">
                    <p class="font-semibold">Error Details:</p>
                    <div class="bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm">
                        <p>Code: {errorDetails.code}</p>
                        <p>Status: {errorDetails.status}</p>
                        {#if errorDetails.details && Object.keys(errorDetails.details).length > 0}
                            <p>Details: {JSON.stringify(errorDetails.details, null, 2)}</p>
                        {/if}
                    </div>
                    <p class="mt-2 text-sm">Check the browser console for more information.</p>
                </div>
            {/if}
        </div>
    {/if}
    
    {#if success}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{success}</p>
        </div>
    {/if}
    
    <!-- Created User Info -->
    {#if createdUser}
        <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <h3 class="font-bold">New Test User Created:</h3>
            <div class="mt-2">
                <p><strong>Email:</strong> {createdUser.email}</p>
                <p><strong>Password:</strong> {createdUser.password}</p>
                <p class="text-green-600 mt-2"><strong>Note:</strong> This user is created with a pre-verified email and automatically signed in.</p>
                <div class="flex space-x-2 mt-2">
                    <button 
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        on:click={() => copyToClipboard(`Email: ${createdUser.email}\nPassword: ${createdUser.password}`)}
                    >
                        Copy Credentials
                    </button>
                    <button 
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        on:click={() => goto('/profile')}
                    >
                        Go to Profile
                    </button>
                    <button 
                        class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
                        on:click={() => goto('/feed')}
                    >
                        Go to Feed
                    </button>
                </div>
                
                {#if loginStatus}
                    <div class="mt-2 p-2 {loginError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} rounded">
                        <p><strong>Login Status:</strong> {loginStatus}</p>
                        {#if loginError}
                            <p class="text-red-600"><strong>Error:</strong> {loginError}</p>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
    
    <!-- Actions -->
    <div class="flex space-x-4 mb-6">
        <button 
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            on:click={createTestUser}
            disabled={loading}
        >
            {loading ? 'Creating...' : 'Create Test User'}
        </button>
        
        <button 
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            on:click={loadTestUsers}
            disabled={loading}
        >
            Refresh List
        </button>
    </div>
    
    <!-- Debug Session Information -->
    <div class="bg-gray-100 border border-gray-400 text-gray-800 px-4 py-3 rounded mb-6">
        <h3 class="font-bold">Debug Information</h3>
        <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
            on:click={checkSession}
        >
            Refresh Session Info
        </button>
        
        {#if sessionInfo}
            <div class="mt-2">
                <h4 class="font-semibold">Current Session:</h4>
                <div class="bg-gray-800 text-white p-3 rounded mt-2 overflow-x-auto text-sm">
                    {#if sessionInfo.error}
                        <p>Error: {sessionInfo.error}</p>
                    {:else if sessionInfo.session}
                        <p>Authenticated: Yes</p>
                        <p>User ID: {sessionInfo.session.user.id}</p>
                        <p>Email: {sessionInfo.session.user.email}</p>
                        <p>Email Verified: {sessionInfo.session.user.email_confirmed_at ? 'Yes' : 'No'}</p>
                        <p>Created At: {new Date(sessionInfo.session.user.created_at).toLocaleString()}</p>
                        <p>Last Sign In: {new Date(sessionInfo.session.user.last_sign_in_at).toLocaleString()}</p>
                        <p>Session Expires: {new Date(sessionInfo.session.expires_at * 1000).toLocaleString()}</p>
                        <div class="mt-2 pt-2 border-t border-gray-600">
                            <p class="text-green-400">Protected pages you can now access:</p>
                            <ul class="list-disc ml-6 mt-1">
                                <li><a href="/profile" class="text-blue-300 hover:underline">/profile</a></li>
                                <li><a href="/feed" class="text-blue-300 hover:underline">/feed</a></li>
                                <li><a href="/premium" class="text-blue-300 hover:underline">/premium</a></li>
                            </ul>
                        </div>
                    {:else}
                        <p>Authenticated: No</p>
                        <p>No active session</p>
                    {/if}
                </div>
            </div>
        {/if}
        
        <div class="mt-4">
            <h4 class="font-semibold">Authentication Troubleshooting:</h4>
            <ul class="list-disc ml-6 mt-2">
                <li>Test users are now automatically signed in after creation.</li>
                <li>If protected pages still redirect to login, try refreshing the session info above.</li>
                <li>Check browser console for any authentication errors.</li>
                <li>Ensure cookies are being properly set (check Application tab in DevTools).</li>
                <li>Try clearing browser cookies and local storage if issues persist.</li>
                <li>Verify that the user has a corresponding profile in the profiles table.</li>
            </ul>
        </div>
    </div>
    
    <!-- SQL Method Info -->
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
        <h3 class="font-bold">About Test User Creation</h3>
        <p class="mt-2">Test users are created using SQL functions that bypass email verification. The implementation:</p>
        <ul class="list-disc ml-6 mt-2">
            <li>Directly inserts a user into the auth.users table</li>
            <li>Sets email_confirmed_at to the current time, which marks the email as already verified</li>
            <li>Creates a corresponding profile in the public.profiles table</li>
            <li>Generates a unique email with timestamp to avoid conflicts</li>
        </ul>
        <p class="mt-2">These users can be used immediately without email verification.</p>
    </div>
    
    <!-- Test Users List -->
    <div class="bg-white shadow-md rounded p-4">
        <h2 class="text-xl font-bold mb-4">Recent Users ({testUsers.length})</h2>
        
        {#if loading}
            <p class="text-gray-500">Loading...</p>
        {:else if testUsers.length === 0}
            <p class="text-gray-500">No users found.</p>
        {:else}
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 border-b text-left">Username</th>
                            <th class="py-2 px-4 border-b text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each testUsers as user}
                            <tr class="hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{user.username || 'No username'}</td>
                                <td class="py-2 px-4 border-b">{new Date(user.created_at).toLocaleString()}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
