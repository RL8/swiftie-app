import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Get the current session
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
        throw redirect(303, '/login');
    }
    
    // If user is already verified, redirect to feed
    if (session.user.email_confirmed_at) {
        throw redirect(303, '/feed');
    }
    
    return {
        email: session.user.email
    };
};

export const actions: Actions = {
    // Action to resend verification email
    resendVerification: async ({ locals }) => {
        try {
            const { data: { session } } = await locals.supabase.auth.getSession();
            
            if (!session) {
                return fail(401, { 
                    success: false, 
                    message: 'You must be logged in to request a verification email' 
                });
            }
            
            const { error } = await locals.supabase.auth.resend({
                type: 'signup',
                email: session.user.email
            });
            
            if (error) {
                return fail(500, { 
                    success: false, 
                    message: error.message 
                });
            }
            
            return { 
                success: true, 
                message: 'Verification email sent successfully' 
            };
        } catch (error) {
            return fail(500, { 
                success: false, 
                message: 'An unexpected error occurred' 
            });
        }
    },
    
    // Action to update email
    updateEmail: async ({ locals, request }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        
        if (!email) {
            return fail(400, { 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        try {
            const { data: { session } } = await locals.supabase.auth.getSession();
            
            if (!session) {
                return fail(401, { 
                    success: false, 
                    message: 'You must be logged in to update your email' 
                });
            }
            
            const { error } = await locals.supabase.auth.updateUser({
                email
            });
            
            if (error) {
                return fail(500, { 
                    success: false, 
                    message: error.message 
                });
            }
            
            // Send verification email to the new address
            await locals.supabase.auth.resend({
                type: 'signup',
                email
            });
            
            return { 
                success: true, 
                message: 'Email updated successfully. Please check your inbox for a verification link.',
                newEmail: email
            };
        } catch (error) {
            return fail(500, { 
                success: false, 
                message: 'An unexpected error occurred' 
            });
        }
    }
};

export const prerender = false;
