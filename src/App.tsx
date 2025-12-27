import { useState, useEffect } from 'react';
import './App.css';
import { ScoreTable } from './components/ScoreTable';
import { GameSetup } from './components/GameSetup';

import { GameConfig } from './types';
import { config313 } from './games/313';
import { configMexicanTrain } from './games/mexicanTrain';
import { configUpAndDown } from './games/upAndDown';

function App() {
  const games = [config313, configMexicanTrain, configUpAndDown];

  const [selectedGame, setSelectedGame] = useState<GameConfig>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      const game = games.find(g => g.gameName === parsed.gameName);
      if (game) return game;
    }
    return config313;
  });

  const [players, setPlayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.players) return parsed.players;
    }
    return [];
  });

  const [gameStarted, setGameStarted] = useState(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.gameStarted || false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({
      gameName: selectedGame.gameName,
      players,
      gameStarted
    }));
  }, [selectedGame, players, gameStarted]);

  const handleStartGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setGameStarted(true);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new game? This will clear current scores.')) {
      setGameStarted(false);
      setPlayers([]);
      localStorage.removeItem('gameState');
      localStorage.removeItem('gameData');
    }
  };

  return (
    <>
      <div className="header-actions">
        {gameStarted && (
          <button onClick={handleReset} className="reset-btn">← New Game</button>
        )}
        <h1>Scoreboards</h1>
      </div>

      {!gameStarted ? (
        <div className="setup-container">
          <div className="game-selector">
            <label htmlFor="game-select">Select Game:</label>
            <select
              id="game-select"
              value={selectedGame.gameName}
              onChange={(e) => {
                const game = games.find(g => g.gameName === e.target.value);
                if (game) setSelectedGame(game);
              }}
            >
              {games.map(g => (
                <option key={g.gameName} value={g.gameName}>{g.gameName}</option>
              ))}
            </select>
          </div>

          <GameSetup
            onStartGame={handleStartGame}
            minPlayers={selectedGame.playerCount.min}
            maxPlayers={selectedGame.playerCount.max}
          />
        </div>
      ) : (
        <>
          <h2>{selectedGame.gameName}</h2>
          <ScoreTable config={selectedGame} playerNames={players} />
        </>
      )}
    </>
  );
}

export default App;

