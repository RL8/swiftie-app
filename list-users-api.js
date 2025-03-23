// Simple script to fetch users from our API endpoint
const fetchUsers = async () => {
  try {
    console.log('Fetching users from API endpoint...');
    const response = await fetch('http://localhost:5173/api/create-test-user');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('API returned an error:', data.error);
      return;
    }
    
    console.log('\nUsers from API:');
    
    // Format the date for better readability
    const formattedUsers = data.users.map(user => ({
      ...user,
      created_at: new Date(user.created_at).toLocaleString()
    }));
    
    // Display each user in a more readable format
    formattedUsers.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username || 'No username'}`);
      console.log(`Created: ${user.created_at}`);
    });
    
    console.log(`\nTotal users: ${data.users.length}`);
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
};

fetchUsers();
