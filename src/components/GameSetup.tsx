import { useState } from 'react';

interface GameSetupProps {
    onStartGame: (players: string[]) => void;
    minPlayers: number;
    maxPlayers: number;
}

export const GameSetup = ({ onStartGame, minPlayers, maxPlayers }: GameSetupProps) => {
    const [players, setPlayers] = useState<string[]>(['', '']);

    const handlePlayerChange = (index: number, name: string) => {
        const newPlayers = [...players];
        newPlayers[index] = name;
        setPlayers(newPlayers);
    };

    const addPlayer = () => {
        if (players.length < maxPlayers) {
            setPlayers([...players, '']);
        }
    };

    const removePlayer = (index: number) => {
        if (players.length > minPlayers) {
            const newPlayers = players.filter((_, i) => i !== index);
            setPlayers(newPlayers);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validPlayers = players.filter((p) => p.trim() !== '');
        if (validPlayers.length >= minPlayers) {
            onStartGame(validPlayers);
        }
    };

    return (
        <div className="game-setup">
            <h2>Who's Playing?</h2>
            <form onSubmit={handleSubmit}>
                {players.map((player, index) => (
                    <div key={index} className="player-input-group">
                        <input
                            type="text"
                            placeholder={`Player ${index + 1}`}
                            value={player}
                            onChange={(e) => handlePlayerChange(index, e.target.value)}
                            required
                        />
                        {players.length > minPlayers && (
                            <button
                                type="button"
                                className="remove-player-btn"
                                onClick={() => removePlayer(index)}
                                aria-label="Remove player"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                <div className="setup-actions">
                    {players.length < maxPlayers && (
                        <button type="button" onClick={addPlayer} className="add-player-btn">
                            + Add Player
                        </button>
                    )}
                    <button type="submit" className="start-game-btn" disabled={players.filter(p => p.trim()).length < minPlayers}>
                        Start Game
                    </button>
                </div>
            </form>
        </div>
    );
};
