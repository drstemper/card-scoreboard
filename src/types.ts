export interface GameConfig {
  gameName: string;
  rounds: number[];
  getWildCard?: (round: number) => string;
  scoringDirection: 'asc' | 'desc';
  playerCount: {
    min: number;
    max: number;
  };
}
