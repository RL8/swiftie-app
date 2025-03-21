import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals }) => {
  const code = url.searchParams.get('code');
  
  if (code) {
    await locals.supabase.auth.exchangeCodeForSession(code);
  }
  
  throw redirect(303, '/profile');
};
