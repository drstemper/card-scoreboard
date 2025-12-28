import { useState, useEffect } from 'react';
import { GameConfig } from '../types';

interface ScoreTableProps {
  config: GameConfig;
  playerNames: string[];
  onReset: () => void;
  startingDealerIndex: number;
}

export const ScoreTable = ({ config, playerNames, onReset, startingDealerIndex }: ScoreTableProps) => {
  // Resolve rounds based on player count if it's a function
  const rounds =
    typeof config.rounds === 'function'
      ? config.rounds(playerNames.length)
      : config.rounds;

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

  // Initialize queenOfSpades state
  const [queenOfSpades, setQueenOfSpades] = useState<boolean[][]>(() => {
    const saved = localStorage.getItem('gameData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.queenOfSpades && parsed.queenOfSpades.length === rounds.length && parsed.queenOfSpades[0].length === playerNames.length) {
        return parsed.queenOfSpades;
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
      queenOfSpades,
      bids
    }));
  }, [scores, wentOut, queenOfSpades, bids]);

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

  const toggleQueenOfSpades = (roundIndex: number, playerIndex: number) => {
    const newQueenOfSpades = queenOfSpades.map((round, rIndex) => {
      if (rIndex === roundIndex) {
        // Toggle the selected player, clear others in the same row
        return round.map((q, pIndex) => (pIndex === playerIndex ? !q : false));
      }
      return round;
    });
    setQueenOfSpades(newQueenOfSpades);
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
      <div className="table-header">
        <h2>{config.gameName} Scoreboard</h2>
      </div>
      <table>
        <thead>
          <tr className="header-names-row">
            <th>Round</th>
            {config.showDealer !== false && <th>Dealer</th>}
            {playerNames.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
          <tr className="header-totals-row">
            <th colSpan={config.showDealer !== false ? 2 : 1}>Total</th>
            {totals.map((total, playerIndex) => (
              <th key={`top-total-${playerIndex}`}>{total}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(() => {
            const runningTotals = new Array(playerNames.length).fill(0);

            return rounds.map((round, roundIndex) => {
              const dealerIndex = (roundIndex + startingDealerIndex) % playerNames.length;
              // Determine the display value for the round
              const resolvedRoundValue =
                config.getWildCard && typeof round === 'number'
                  ? config.getWildCard(round)
                  : round;

              // Calculate total bids for validation
              let totalBids = 0;
              let allBidsEntered = true;
              if (config.bidding) {
                for (let i = 0; i < playerNames.length; i++) {
                  const bid = bids[roundIndex][i];
                  if (typeof bid === 'number') {
                    totalBids += bid;
                  } else {
                    allBidsEntered = false;
                  }
                }
              }

              return (
                <tr key={`round-${roundIndex}`}>
                  <td className="round-label">
                    <div className="round-info">
                      <span>{resolvedRoundValue}</span>
                    </div>
                  </td>
                  {config.showDealer !== false && (
                    <td className="dealer-name">{playerNames[dealerIndex]}</td>
                  )}
                  {playerNames.map((_, playerIndex) => {
                    const score = scores[roundIndex][playerIndex];
                    const bid = bids[roundIndex][playerIndex];

                    // Update running total
                    if (typeof score === 'number') {
                      runningTotals[playerIndex] += score;
                    }
                    const currentRunningTotal = runningTotals[playerIndex];

                    let scoreClass = 'score-input';
                    let madeBid = false;

                    if (config.bidding && typeof score === 'number' && typeof bid === 'number') {
                      if (score === 10 + bid) {
                        scoreClass += ' success';
                        madeBid = true;
                      } else {
                        scoreClass += ' failure';
                      }
                    }

                    const isDealer = playerIndex === dealerIndex;
                    const isInvalidBid = config.bidding && isDealer && allBidsEntered && totalBids === round;
                    const bidClass = `bid-input ${isInvalidBid ? 'error' : ''}`;

                    return (
                      <td
                        key={`score-${roundIndex}-${playerIndex}`}
                        className={`score-cell ${wentOut[roundIndex][playerIndex] ? 'went-out' : ''} ${queenOfSpades[roundIndex][playerIndex] ? 'queen-of-spades' : ''}`}
                      >
                        <div className="cell-content">
                          <div className="inputs-wrapper">
                            {config.bidding && (
                              <div className="bid-wrapper">
                                <input
                                  type="number"
                                  className={bidClass}
                                  placeholder="Bid"
                                  value={bids[roundIndex][playerIndex]}
                                  onChange={(e) =>
                                    handleBidChange(
                                      roundIndex,
                                      playerIndex,
                                      e.target.value
                                    )
                                  }
                                  title={isInvalidBid ? "Total bids cannot equal round number" : "Bid"}
                                />
                              </div>
                            )}

                            {config.bidding ? (
                              <div className={`running-total-display ${typeof score === 'number' && typeof bid === 'number' ? (madeBid ? 'success' : 'failure') : ''}`}>
                                {typeof score === 'number' ? currentRunningTotal : ''}
                              </div>
                            ) : (
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
                            )}
                          </div>

                          {/* Action Area: Either Checkbox (for bidding) or Star (for others) */}
                          <div className="action-area">
                            {config.bidding ? (
                              <div className="bid-actions">
                                <button
                                  className={`bid-btn made ${madeBid ? 'active' : ''}`}
                                  onClick={() => {
                                    if (typeof bid === 'number') {
                                      const targetScore = 10 + bid;
                                      const newScore = score === targetScore ? '' : targetScore;
                                      handleScoreChange(roundIndex, playerIndex, newScore.toString());
                                    }
                                  }}
                                  title="Made Bid"
                                  tabIndex={-1}
                                >
                                  ✓
                                </button>
                                <button
                                  className={`bid-btn missed ${score === 0 && typeof bid === 'number' ? 'active' : ''}`}
                                  onClick={() => {
                                    if (typeof bid === 'number') {
                                      const newScore = score === 0 ? '' : 0;
                                      handleScoreChange(roundIndex, playerIndex, newScore.toString());
                                    }
                                  }}
                                  title="Missed Bid"
                                  tabIndex={-1}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : config.showQueenOfSpades ? (
                              <button
                                className={`queen-toggle ${queenOfSpades[roundIndex][playerIndex] ? 'active' : ''}`}
                                onClick={() => toggleQueenOfSpades(roundIndex, playerIndex)}
                                title="Queen of Spades"
                                tabIndex={-1}
                              >
                                Q♠
                              </button>
                            ) : (
                              config.showWentOut !== false && (
                                <button
                                  className={`went-out-toggle ${wentOut[roundIndex][playerIndex] ? 'active' : ''}`}
                                  onClick={() => toggleWentOut(roundIndex, playerIndex)}
                                  title="Toggle Went Out"
                                  tabIndex={-1}
                                >
                                  ★
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            });
          })()}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={config.showDealer !== false ? 2 : 1}>Total</th>
            {totals.map((total, playerIndex) => (
              <th key={`total-${playerIndex}`}>{total}</th>
            ))}
          </tr>
        </tfoot>
      </table>
      <div className="table-footer">
        <button onClick={onReset} className="reset-btn">New Game</button>
      </div>
    </div>
  );
};
