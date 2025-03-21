import type { ProfileState, UserProfile } from '$lib/types/user';
import { initiateRedditAuth as startRedditAuth } from '$lib/reddit';

export function createUserProfileContext() {
    // Initialize user profile state with default values
    const profile = $state<UserProfile>({
        username: '',
        profileState: 'unregistered',
        albumsRated: 0,
        listsCreated: 0,
        redditUsername: '',
        redditVerified: false
    });

    // Methods for managing user profile
    function getProfileState(): ProfileState {
        return profile.profileState;
    }

    async function initiateRedditAuth() {
        // Implement Reddit OAuth flow using the reddit.ts module
        startRedditAuth();
    }

    function setRedditUser(username: string, verified: boolean = false) {
        profile.redditUsername = username;
        profile.redditVerified = verified;
        
        if (verified) {
            // Update profile state when Reddit verification is successful
            profile.profileState = 'free';
            profile.username = username;
        }
    }

    async function initiateUpgrade() {
        // TODO: Implement payment flow
        // Placeholder implementation
        profile.profileState = 'premium';
    }

    function getUserDetails() {
        return {
            username: profile.username,
            profileState: profile.profileState,
            albumsRated: profile.albumsRated,
            listsCreated: profile.listsCreated,
            redditUsername: profile.redditUsername,
            redditVerified: profile.redditVerified
        };
    }

    function incrementAlbumsRated() {
        profile.albumsRated++;
    }

    function incrementListsCreated() {
        profile.listsCreated++;
    }

    return {
        get username() { return profile.username; },
        get listsCreated() { return profile.listsCreated; },
        get albumsRated() { return profile.albumsRated; },
        get redditUsername() { return profile.redditUsername; },
        get redditVerified() { return profile.redditVerified; },
        getProfileState,
        getUserDetails,
        initiateRedditAuth,
        setRedditUser,
        initiateUpgrade,
        incrementAlbumsRated,
        incrementListsCreated
    };
}

// Type for the context return value
export type UserProfileContext = ReturnType<typeof createUserProfileContext>;