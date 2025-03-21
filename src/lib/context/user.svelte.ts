import type { ProfileState, UserProfile } from '$lib/types/user';

export function createUserProfileContext() {
    // Initialize user profile state with default values
    const profile = $state<UserProfile>({
        username: '',
        profileState: 'unregistered',
        albumsRated: 0,
        listsCreated: 0
    });

    // Methods for managing user profile
    function getProfileState(): ProfileState {
        return profile.profileState;
    }

    function setUsername(username: string) {
        profile.username = username;
    }

    async function initiateRedditAuth() {
        // TODO: Implement Reddit OAuth flow
        // Placeholder implementation
        profile.profileState = 'free';
        profile.username = 'SwiftFan123';
        profile.redditUsername = 'swift_enthusiast';
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
            redditUsername: profile.redditUsername
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
        get profileState() { return profile.profileState; },
        getProfileState,
        setUsername,
        initiateRedditAuth,
        initiateUpgrade,
        getUserDetails,
        incrementAlbumsRated,
        incrementListsCreated
    };
}

// Type for the context return value
export interface UserProfileContext {
    username: string;
    listsCreated: number;
    albumsRated: number;
    profileState: ProfileState;
    getProfileState: () => ProfileState;
    setUsername: (username: string) => void;
    initiateRedditAuth: () => Promise<void>;
    initiateUpgrade: () => Promise<void>;
    getUserDetails: () => any;
    incrementAlbumsRated: () => void;
    incrementListsCreated: () => void;
}