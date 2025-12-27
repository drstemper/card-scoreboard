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

  const handleMadeBidChange = (
    roundIndex: number,
    playerIndex: number,
    checked: boolean
  ) => {
    const bid = bids[roundIndex][playerIndex];
    if (typeof bid === 'number') {
      const newScore = checked ? 10 + bid : 0;
      handleScoreChange(roundIndex, playerIndex, newScore.toString());
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>{config.gameName} Scoreboard</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            {config.showDealer !== false && <th>Dealer</th>}
            {playerNames.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
          <tr>
            <th colSpan={config.showDealer !== false ? 2 : 1}>Total</th>
            {totals.map((total, playerIndex) => (
              <th key={`top-total-${playerIndex}`}>{total}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rounds.map((round, roundIndex) => {
            const dealerIndex = (roundIndex + startingDealerIndex) % playerNames.length;
            // Determine the display value for the round
            const resolvedRoundValue = config.getWildCard ? config.getWildCard(round) : round;

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
                      className={`score-cell ${wentOut[roundIndex][playerIndex] ? 'went-out' : ''}`}
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

                        {/* Action Area: Either Checkbox (for bidding) or Star (for others) */}
                        <div className="action-area">
                          {config.bidding ? (
                            <input
                              type="checkbox"
                              className="made-bid-checkbox"
                              checked={madeBid}
                              onChange={(e) =>
                                handleMadeBidChange(
                                  roundIndex,
                                  playerIndex,
                                  e.target.checked
                                )
                              }
                              title="Made Bid?"
                            />
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
          })}
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
