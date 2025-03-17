import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';

export const load: PageServerLoad = async (event) => {
    // This will redirect to login if user is not authenticated
    const { session } = await requireAuth(event);
    
    return {
        session
    };
};
