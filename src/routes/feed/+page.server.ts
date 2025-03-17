import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
    // This will redirect to login if user is not authenticated
    const { session } = await requireAuth(event);
    
    // Return both the session and additional user data
    return {
        session,
        // This is where you'd return additional feed data from the database
        userData: session ? {
            email: session.user.email,
            lastLogin: session.user.last_sign_in_at,
            joinDate: session.user.created_at
        } : null
    };
};
