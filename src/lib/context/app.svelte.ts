/**
 * Main application context for managing app-wide state
 */

export type AppStatus = 'onboarding' | 'authenticated' | 'guest';
export type SubscriptionType = 'free' | 'premium';

export interface AppState {
    status: AppStatus;
    hasCompletedOrientation: boolean;
    subscription: SubscriptionType;
}

export function createAppContext() {
    // Core state
    const state = $state<AppState>({
        status: 'onboarding',
        hasCompletedOrientation: false,
        subscription: 'free'
    });

    // Methods
    function completeOrientation() {
        state.hasCompletedOrientation = true;
        state.status = 'guest';
    }

    function setAuthenticated() {
        state.status = 'authenticated';
    }

    function setGuest() {
        state.status = 'guest';
    }

    function setPremium() {
        state.subscription = 'premium';
    }

    function setFree() {
        state.subscription = 'free';
    }

    function reset() {
        state.status = 'onboarding';
        state.hasCompletedOrientation = false;
        state.subscription = 'free';
    }

    // Return read-only access to state and methods
    return {
        get state() { return state; },
        completeOrientation,
        setAuthenticated,
        setGuest,
        setPremium,
        setFree,
        reset
    };
}

// Type for the context return value
export type AppContext = ReturnType<typeof createAppContext>;