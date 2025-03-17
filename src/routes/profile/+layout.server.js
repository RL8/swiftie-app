/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
  const { data: { session } } = await locals.supabase.auth.getSession();
  
  // If user is not logged in and trying to access a protected route, redirect to login
  if (!session) {
    return {
      redirect: '/login',
      redirectTo: url.pathname
    };
  }
  
  return {
    session
  };
}
