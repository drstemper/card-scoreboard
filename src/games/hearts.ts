
import { GameConfig } from '../types';

export const configHearts: GameConfig = {
    gameName: 'Hearts',
    rounds: (playerCount: number) => {
        const rounds: string[] = [];
        const maxK = Math.floor(playerCount / 2);
        const isEven = playerCount % 2 === 0;

        let k = 1;
        let nextDir: 'R' | 'L' = 'R';
        const numRounds = 50; // Generate enough rounds for a long game

        for (let i = 0; i < numRounds; i++) {
            if (nextDir === 'R') {
                if (k === maxK && isEven) {
                    rounds.push('Across');
                    k = 1;
                    nextDir = 'R'; // Reset sequence
                } else {
                    rounds.push(`R${k}`);
                    nextDir = 'L';
                }
            } else {
                rounds.push(`L${k}`);
                if (k === maxK) {
                    // End of sequence for odd players
                    k = 1;
                    nextDir = 'R';
                } else {
                    k++;
                    nextDir = 'R';
                }
            }
        }
        return rounds;
    },
    showWentOut: false,
    showQueenOfSpades: true,
    showDealer: true,
    scoringDirection: 'desc', // Lower scores are better in Hearts
    playerCount: {
        min: 3,
        max: 8, // Supports standard tables
    },
};
