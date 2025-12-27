import { GameConfig } from '../types';

export const config313: GameConfig = {
  gameName: '3-13',
  rounds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  getWildCard: (round: number) => {
    if (round === 11) return 'J';
    if (round === 12) return 'Q';
    if (round === 13) return 'K';
    return round.toString();
  },
  scoringDirection: 'asc',
  playerCount: {
    min: 2,
    max: 6, // Typical max for single deck, but can be more with multiple decks
  },
};
