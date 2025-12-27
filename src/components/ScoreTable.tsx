import { useState, useEffect } from 'react';
import { GameConfig } from '../types';

interface ScoreTableProps {
  config: GameConfig;
  playerNames: string[];
}

export const ScoreTable = ({ config, playerNames }: ScoreTableProps) => {
  // Resolve rounds based on player count if it's a function
  const rounds = Array.isArray(config.rounds)
    ? config.rounds
    : config.rounds(playerNames.length);

  // Initialize scores state with a 2D array based on rounds and players
  const [scores, setScores] = useState<(number | '')[][]>(() => {
    const saved = localStorage.getItem('gameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.scores && parsed.scores.length === rounds.length && parsed.scores[0].length === playerNames.length) {
        return parsed.scores;
      }
    }
    return Array(rounds.length)
      .fill(null)
      .map(() => Array(playerNames.length).fill(''));
  });

  // Initialize wentOut state
  const [wentOut, setWentOut] = useState<boolean[][]>(() => {
    const saved = localStorage.getItem('gameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.wentOut && parsed.wentOut.length === rounds.length && parsed.wentOut[0].length === playerNames.length) {
        return parsed.wentOut;
      }
    }
    return Array(rounds.length)
      .fill(null)
      .map(() => Array(playerNames.length).fill(false));
  });

  // Initialize bids state
  const [bids, setBids] = useState<(number | '')[][]>(() => {
    const saved = localStorage.getItem('gameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.bids && parsed.bids.length === rounds.length && parsed.bids[0].length === playerNames.length) {
        return parsed.bids;
      }
    }
    return Array(rounds.length)
      .fill(null)
      .map(() => Array(playerNames.length).fill(''));
  });

  useEffect(() => {
    localStorage.setItem('gameData', JSON.stringify({
      scores,
      wentOut,
      bids
    }));
  }, [scores, wentOut, bids]);

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

  const handleBidChange = (
    roundIndex: number,
    playerIndex: number,
    value: string
  ) => {
    const newBids = bids.map((round, rIndex) => {
      if (rIndex === roundIndex) {
        return round.map((b, pIndex) => {
          if (pIndex === playerIndex) {
            if (value === '') return '';
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? '' : parsed;
          }
          return b;
        });
      }
      return round;
    });
    setBids(newBids);
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
          {rounds.map((round, roundIndex) => {
            const dealerIndex = roundIndex % playerNames.length;
            // Determine the display value for the round
            const resolvedRoundValue = config.getWildCard ? config.getWildCard(round) : round;
            return (
              <tr key={`round-${roundIndex}`}>
                <td className="round-label">
                  <div className="round-info">
                    <span>{resolvedRoundValue}</span>
                  </div>
                </td>
                <td className="dealer-name">{playerNames[dealerIndex]}</td>
                {playerNames.map((_, playerIndex) => {
                  const score = scores[roundIndex][playerIndex];
                  const bid = bids[roundIndex][playerIndex];

                  let scoreClass = 'score-input';
                  if (config.bidding && typeof score === 'number' && typeof bid === 'number') {
                    // Standard Oh Hell/Oh Poop scoring check: 10 + bid
                    // If score matches 10 + bid, it's a success (Green)
                    // If not, it's a failure (Red)
                    // Wait, user said "if a player gets their bid". 
                    // Usually getting bid means score = 10 + bid.
                    // But maybe they just mean score >= bid? 
                    // "if they miss, mark it with red".
                    // Let's assume standard scoring: Success = (score === 10 + bid).
                    // Actually, some play 1 point per trick + 10 bonus.
                    // Let's just check if score == 10 + bid.
                    if (score === 10 + bid) {
                      scoreClass += ' success';
                    } else {
                      scoreClass += ' failure';
                    }
                  }

                  return (
                    <td
                      key={`score-${roundIndex}-${playerIndex}`}
                      className={`score-cell ${wentOut[roundIndex][playerIndex] ? 'went-out' : ''}`}
                    >
                      <div className="cell-content">
                        <div className="inputs-wrapper">
                          {config.bidding && (
                            <input
                              type="number"
                              className="bid-input"
                              placeholder="Bid"
                              value={bids[roundIndex][playerIndex]}
                              onChange={(e) =>
                                handleBidChange(
                                  roundIndex,
                                  playerIndex,
                                  e.target.value
                                )
                              }
                            />
                          )}
                          <input
                            type="number"
                            className={scoreClass}
                            value={scores[roundIndex][playerIndex]}
                            onChange={(e) =>
                              handleScoreChange(
                                roundIndex,
                                playerIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
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
                  );
                })}
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
