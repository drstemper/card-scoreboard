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
  showWentOut: true,
  showDealer: true,
  scoringDirection: 'asc',
  playerCount: {
    min: 2,
    max: 20, // Typical max for single deck, but can be more with multiple decks
  },
};
