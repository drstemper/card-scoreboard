import { useState, useEffect } from 'react';
import { GameSetup } from './components/GameSetup';
import { ScoreTable } from './components/ScoreTable';
import { GameSelection } from './components/GameSelection';
import { config313 } from './games/313';
import { configMexicanTrain } from './games/mexicanTrain';
import { configUpAndDown } from './games/upAndDown';
import { configHearts } from './games/hearts';
import { GameConfig } from './types';
import './App.css';

const games: GameConfig[] = [config313, configMexicanTrain, configUpAndDown, configHearts];

function App() {
  const [selectedGame, setSelectedGame] = useState<GameConfig>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedGameName = parsed.selectedGame?.gameName;
      const matchingGame = games.find(g => g.gameName === savedGameName);
      return matchingGame || games[0];
    }
    return games[0];
  });

  const [players, setPlayers] = useState<string[]>(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved).players || [] : [];
  });

  const [gameStarted, setGameStarted] = useState(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved).gameStarted || false : false;
  });
  const [startingDealerIndex, setStartingDealerIndex] = useState(() => {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved).startingDealerIndex || 0 : 0;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify({
      selectedGame,
      players,
      gameStarted,
      startingDealerIndex
    }));
  }, [selectedGame, players, gameStarted, startingDealerIndex]);

  const handleStartGame = (playerNames: string[], dealerIndex: number) => {
    setPlayers(playerNames);
    setStartingDealerIndex(dealerIndex);
    setGameStarted(true);
  };

  console.log('App render. gameStarted:', gameStarted);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new game? Current progress will be lost.')) {
      console.log('Resetting game...');
      setGameStarted(false);
      setPlayers([]);
      setStartingDealerIndex(0);
      localStorage.removeItem('gameState');
      localStorage.removeItem('gameData');
      console.log('Reset complete.');
    }
  };

  const currentGameConfig = selectedGame;

  return (
    <div className="app-container">
      <header>
        <h1>Scoreboard</h1>
      </header>
      <main>
        {!gameStarted ? (
          <>
            <GameSelection
              games={games}
              selectedGame={selectedGame}
              onSelectGame={setSelectedGame}
            />
            <GameSetup
              config={currentGameConfig}
              onStartGame={handleStartGame}
              playerCount={currentGameConfig.playerCount}
            />
          </>
        ) : (
          <ScoreTable
            config={currentGameConfig}
            playerNames={players}
            onReset={handleReset}
            startingDealerIndex={startingDealerIndex}
          />
        )}
      </main>
    </div>
  );
}

export default App;
