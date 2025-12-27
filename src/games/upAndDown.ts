import { GameConfig } from '../types';

export const configUpAndDown: GameConfig = {
    gameName: 'Oh Poop',
    rounds: (playerCount: number) => {
        // Calculate max cards per player (52 cards in a deck)
        // Cap at 13 (King) just to be safe/standard, or let it go higher?
        // User asked for "highest card value we can start with".
        // Let's cap at 10 to keep it reasonable, or 13.
        // Let's use 52 / players, capped at 10 for game length reasons?
        // Or just 52 / players.
        // Let's go with 52 / players, but maybe cap at 10 to avoid super long games with 2 players (26 rounds down and up is 51 rounds!).
        // A standard game usually starts around 7 or 10.
        const maxCards = Math.min(Math.floor(52 / playerCount), 10);

        const rounds: number[] = [];
        // Count down from max to 1
        for (let i = maxCards; i >= 1; i--) {
            rounds.push(i);
        }
        // Count back up to max
        for (let i = 2; i <= maxCards; i++) {
            rounds.push(i);
        }
        return rounds;
    },
    bidding: true,
    scoringDirection: 'asc', // Highest score usually wins in trick-taking, but this is a scoreboard, so we'll assume standard score tracking.
    // Actually, Up and Down is often bid-based. 
    // For a simple scoreboard, we just track points.
    playerCount: {
        min: 2,
        max: 20,
    },
};
