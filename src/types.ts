export interface GameConfig {
  gameName: string;
  rounds: (number | string)[] | ((playerCount: number) => (number | string)[]);
  bidding?: boolean;
  showWentOut?: boolean;
  showQueenOfSpades?: boolean;
  showDealer?: boolean;
  getWildCard?: (round: number) => string;
  scoringDirection: 'asc' | 'desc';
  playerCount: {
    min: number;
    max: number;
  };
}
