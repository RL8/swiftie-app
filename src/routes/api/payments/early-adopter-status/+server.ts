import { json } from '@sveltejs/kit';
import { checkEarlyAdopterAvailability } from '$lib/services/database';

export async function GET({ locals }) {
  try {
    // Check if user is authenticated
    if (!locals.session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check early adopter availability
    const { isAvailable, remainingSpots, totalSpots } = await checkEarlyAdopterAvailability();
    
    return json({
      isAvailable,
      remainingSpots,
      totalSpots
    });
  } catch (error) {
    console.error('Error checking early adopter status:', error);
    return json({ error: 'Failed to check early adopter status' }, { status: 500 });
  }
}
