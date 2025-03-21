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
    redditUsername?: string;   // Reddit username if authenticated via Reddit
    redditVerified?: boolean;  // Whether user is verified as a Swiftie on Reddit
    // Add other user profile fields as needed
}
