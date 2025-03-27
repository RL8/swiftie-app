/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
  // Create a mock session for all users without authentication
  const mockSession = {
    user: {
      id: 'local-user',
      email: 'local@example.com',
      user_metadata: {
        username: 'LocalUser'
      }
    }
  };
  
  return {
    session: mockSession
  };
}
