/**
 * User profile state options
 */
export type ProfileState = 
    | 'unregistered'  // User not logged in
    | 'authenticated' // User is authenticated (base state)
    | 'free'          // Free tier
    | 'premium';      // Premium tier

/**
 * User profile data structure
 */
export interface UserProfile {
    username: string;
    profileState: ProfileState;
    albumsRated: number;
    listsCreated: number;
    // Add other user profile fields as needed
}
