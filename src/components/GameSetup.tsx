import { useState } from 'react';
import { GameConfig } from '../types';

interface GameSetupProps {
    config: GameConfig;
    onStartGame: (playerNames: string[], startingDealerIndex: number) => void;
    playerCount: {
        min: number;
        max: number;
    };
}

export const GameSetup = ({ config, onStartGame, playerCount }: GameSetupProps) => {
    const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
    const [startingDealerIndex, setStartingDealerIndex] = useState(0);

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const addPlayer = () => {
        if (playerNames.length < playerCount.max) {
            setPlayerNames([...playerNames, '']);
        }
    };

    const removePlayer = (index: number) => {
        if (playerNames.length > playerCount.min) {
            const newNames = playerNames.filter((_, i) => i !== index);
            setPlayerNames(newNames);
            if (startingDealerIndex >= newNames.length) {
                setStartingDealerIndex(0);
            }
        }
    };

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty names or use default names if needed
        const finalNames = playerNames.map((name, i) => name.trim() || `Player ${i + 1}`);
        onStartGame(finalNames, startingDealerIndex);
    };

    return (
        <div className="game-setup">
            <h2>{config.gameName} Setup</h2>
            <form onSubmit={handleStart}>
                <div className="player-inputs">
                    {playerNames.map((name, index) => (
                        <div key={index} className="player-input-group">
                            <input
                                type="text"
                                placeholder={`Player ${index + 1}`}
                                value={name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="player-name-input"
                            />
                            {config.showDealer !== false && (
                                <div
                                    className={`dealer-select ${startingDealerIndex === index ? 'selected' : ''}`}
                                    onClick={() => setStartingDealerIndex(index)}
                                    title="Start as Dealer"
                                >
                                    D
                                </div>
                            )}
                            {playerNames.length > playerCount.min && (
                                <button
                                    type="button"
                                    onClick={() => removePlayer(index)}
                                    className="remove-player-btn"
                                    title="Remove Player"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="setup-actions">
                    {playerNames.length < playerCount.max && (
                        <button type="button" onClick={addPlayer} className="add-player-btn">
                            + Add Player
                        </button>
                    )}
                    <button type="submit" className="start-game-btn">
                        Start Game
                    </button>
                </div>
            </form>
        </div>
    );
};
