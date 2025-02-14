import { writable } from 'svelte/store';
import type { Game } from '$lib/types/components';

export const currentGame = writable<Game | null>(null);
export const gameScore = writable<number>(0);
export const gameHistory = writable<Array<{
    gameId: string;
    score: number;
    date: Date;
}>>([]);

export function startGame(game: Game) {
    currentGame.set(game);
    gameScore.set(0);
}

export function endGame(finalScore: number) {
    currentGame.subscribe(game => {
        if (game) {
            gameHistory.update(history => [
                ...history,
                {
                    gameId: game.id,
                    score: finalScore,
                    date: new Date()
                }
            ]);
        }
    });
    
    currentGame.set(null);
    gameScore.set(0);
}
