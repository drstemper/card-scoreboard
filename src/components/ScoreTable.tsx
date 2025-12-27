import { useState } from 'react';
import { GameConfig } from '../types';

interface ScoreTableProps {
  config: GameConfig;
  playerNames: string[];
}

export const ScoreTable = ({ config, playerNames }: ScoreTableProps) => {
  // Initialize scores state with a 2D array based on rounds and players
  const [scores, setScores] = useState<(number | '')[][]>(() =>
    Array(config.rounds.length)
      .fill(null)
      .map(() => Array(playerNames.length).fill(''))
  );

  // Initialize wentOut state
  const [wentOut, setWentOut] = useState<boolean[][]>(() =>
    Array(config.rounds.length)
      .fill(null)
      .map(() => Array(playerNames.length).fill(false))
  );

  // Handle changes to a score input field
  const handleScoreChange = (
    roundIndex: number,
    playerIndex: number,
    value: string
  ) => {
    const newScores = scores.map((round, rIndex) => {
      if (rIndex === roundIndex) {
        return round.map((s, pIndex) => {
          if (pIndex === playerIndex) {
            if (value === '') return '';
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? '' : parsed;
          }
          return s;
        });
      }
      return round;
    });
    setScores(newScores);
  };

  const toggleWentOut = (roundIndex: number, playerIndex: number) => {
    const newWentOut = wentOut.map((round, rIndex) => {
      if (rIndex === roundIndex) {
        return round.map((w, pIndex) => (pIndex === playerIndex ? !w : w));
      }
      return round;
    });
    setWentOut(newWentOut);
  };

  // Calculate total scores for each player
  const totals = playerNames.map((_, playerIndex) =>
    scores.reduce((acc, roundScores) => {
      const score = roundScores[playerIndex];
      return acc + (typeof score === 'number' ? score : 0);
    }, 0)
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Dealer</th>
            {playerNames.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {config.rounds.map((round, roundIndex) => {
            const dealerIndex = roundIndex % playerNames.length;
            return (
              <tr key={`round-${roundIndex}`}>
                <td className="round-label">
                  <div className="round-info">
                    <span>{config.getWildCard ? config.getWildCard(round) : round}</span>
                  </div>
                </td>
                <td className="dealer-name">{playerNames[dealerIndex]}</td>
                {playerNames.map((_, playerIndex) => (
                  <td
                    key={`score-${roundIndex}-${playerIndex}`}
                    className={`score-cell ${wentOut[roundIndex][playerIndex] ? 'went-out' : ''}`}
                  >
                    <div className="cell-content">
                      <input
                        type="number"
                        className="score-input"
                        value={scores[roundIndex][playerIndex]}
                        onChange={(e) =>
                          handleScoreChange(
                            roundIndex,
                            playerIndex,
                            e.target.value
                          )
                        }
                      />
                      <button
                        className={`went-out-toggle ${wentOut[roundIndex][playerIndex] ? 'active' : ''}`}
                        onClick={() => toggleWentOut(roundIndex, playerIndex)}
                        title="Toggle Went Out"
                        tabIndex={-1}
                      >
                        ★
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2}>Total</th>
            {totals.map((total, playerIndex) => (
              <th key={`total-${playerIndex}`}>{total}</th>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
