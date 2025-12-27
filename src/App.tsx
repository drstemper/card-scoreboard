import { useState } from 'react';
import './App.css';
import { ScoreTable } from './components/ScoreTable';
import { GameSetup } from './components/GameSetup';

import { GameConfig } from './types';
import { config313 } from './games/313';
import { configMexicanTrain } from './games/mexicanTrain';
import { configUpAndDown } from './games/upAndDown';

function App() {
  const [selectedGame, setSelectedGame] = useState<GameConfig>(config313);
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const games = [config313, configMexicanTrain, configUpAndDown];

  const handleStartGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setGameStarted(true);
  };

  const handleReset = () => {
    setGameStarted(false);
    setPlayers([]);
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

