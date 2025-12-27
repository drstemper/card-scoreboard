import { GameConfig } from '../types';

interface GameSelectionProps {
    games: GameConfig[];
    selectedGame: GameConfig;
    onSelectGame: (game: GameConfig) => void;
}

export const GameSelection = ({ games, selectedGame, onSelectGame }: GameSelectionProps) => {
    return (
        <div className="game-selector">
            <label htmlFor="game-select">Select Game:</label>
            <select
                id="game-select"
                value={selectedGame.gameName}
                onChange={(e) => {
                    const game = games.find((g) => g.gameName === e.target.value);
                    if (game) {
                        onSelectGame(game);
                    }
                }}
            >
                {games.map((game) => (
                    <option key={game.gameName} value={game.gameName}>
                        {game.gameName}
                    </option>
                ))}
            </select>
        </div>
    );
};
