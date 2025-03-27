import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
    // This will now provide a mock session without authentication
    const { session } = await requireAuth(event);
    
    return {
        session
    };
};
