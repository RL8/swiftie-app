<script>
  import { supabase } from '$lib/supabase/client';
  import { onMount } from 'svelte';
  
  const sessionInfo = $state({
    loading: true,
    session: null,
    error: null,
    details: {}
  });
  
  onMount(async () => {
    try {
      // Check session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        sessionInfo.error = error.message;
        sessionInfo.details.sessionError = error;
      } else {
        sessionInfo.session = data.session;
        
        // If we have a session, get the user profile
        if (data.session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          sessionInfo.details.profile = profileData;
          
          if (profileError) {
            sessionInfo.details.profileError = profileError;
          }
        }
      }
    } catch (err) {
      sessionInfo.error = err instanceof Error ? err.message : 'Unknown error';
      sessionInfo.details.exception = err;
    } finally {
      sessionInfo.loading = false;
    }
  });
  
  function formatJson(obj) {
    return JSON.stringify(obj, null, 2);
  }
</script>

<div class="min-h-screen p-8 bg-gray-100">
  <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-green-600 text-white p-4">
      <h1 class="text-2xl font-bold">Login Test Success Page</h1>
      <p class="text-sm">This page is for testing successful authentication</p>
    </div>
    
    <div class="p-6">
      {#if sessionInfo.loading}
        <div class="flex justify-center my-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p class="text-center text-gray-600">Checking authentication status...</p>
      {:else if sessionInfo.error}
        <div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <h2 class="text-lg font-semibold">Error</h2>
          <p>{sessionInfo.error}</p>
        </div>
      {:else if sessionInfo.session}
        <div class="bg-green-100 border border-green-400 text-green-800 p-4 rounded mb-6">
          <h2 class="text-lg font-semibold">✅ Authentication Successful</h2>
          <p>You are logged in as: <strong>{sessionInfo.session.user.email}</strong></p>
        </div>
        
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4">Session Information</h2>
          <div class="bg-gray-100 p-4 rounded overflow-auto">
            <pre class="text-xs">{formatJson({
              user: sessionInfo.session.user,
              expiresAt: new Date(sessionInfo.session.expires_at * 1000).toISOString(),
              profile: sessionInfo.details.profile
            })}</pre>
          </div>
        </div>
      {:else}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded mb-6">
          <h2 class="text-lg font-semibold">⚠️ Not Authenticated</h2>
          <p>You are not logged in.</p>
        </div>
      {/if}
      
      <div class="mt-8 flex gap-4">
        <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
          Go Home
        </a>
        <a href="/login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Back to Login
        </a>
      </div>
    </div>
  </div>
</div>
