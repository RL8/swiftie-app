// Common component props and types

// Button Types
export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'compact' | 'default';

export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

// Layout Types
export type HeaderVariant = 'base' | 'progress';
export type FooterVariant = 'base' | 'button';

export interface HeaderProps {
    title: string;
    subtitle?: string;
    variant?: HeaderVariant;
    progress?: number;
    maxProgress?: number;
}

export interface FooterProps {
    variant?: FooterVariant;
    hasBorder?: boolean;
}

// Album Types
export interface Album {
    id: string;
    title: string;
    coverArt: string;
    releaseYear: number;
    isTaylorsVersion: boolean;
    color: string;
    songs: string[];
}

// Game Types
export interface Game {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'lyrics' | 'trivia' | 'memory';
    imageUrl?: string;
}

// User Types
export interface UserProfile {
    username: string;
    favoriteAlbum?: Album;
    gamesPlayed: number;
    highScores: Record<string, number>;
    achievements: string[];
}
