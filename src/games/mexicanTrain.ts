import { GameConfig } from '../types';

export const configMexicanTrain: GameConfig = {
    gameName: 'Mexican Train',
    // Standard game goes from Double 12 down to Double 0
    rounds: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    getWildCard: (round: number) => `${round} | ${round}`,
    scoringDirection: 'asc', // Lowest score wins
    playerCount: {
        min: 2,
        max: 20,
    },
};
