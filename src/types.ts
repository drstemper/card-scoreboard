export interface GameConfig {
  gameName: string;
  rounds: number[] | ((playerCount: number) => number[]);
  bidding?: boolean;
  showWentOut?: boolean;
  showDealer?: boolean;
  getWildCard?: (round: number) => string;
  scoringDirection: 'asc' | 'desc';
  playerCount: {
    min: number;
    max: number;
  };
}
