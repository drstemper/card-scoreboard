import { useState } from 'react';
import './App.css';
import { ScoreTable } from './components/ScoreTable';
import { GameSetup } from './components/GameSetup';
import { config313 } from './games/313';

function App() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setGameStarted(true);
  };

  return (
    <>
      <h1>Universal Scoreboard</h1>
      <h2>{config313.gameName}</h2>

      {!gameStarted ? (
        <GameSetup
          onStartGame={handleStartGame}
          minPlayers={config313.playerCount.min}
          maxPlayers={config313.playerCount.max}
        />
      ) : (
        <ScoreTable config={config313} playerNames={players} />
      )}
    </>
  );
}

export default App;

