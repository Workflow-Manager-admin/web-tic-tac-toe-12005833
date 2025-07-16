import React, { useState, useEffect } from "react";
import "./App.css";

/*
  PUBLIC_INTERFACE
  App - Main tic tac toe game component.

  Features:
  - Interactive and responsive grid, centered layout.
  - Two player local (X, O) play.
  - Game reset/restart button.
  - Displays current player's turn, and announces winner/tie.
  - Uses modern, minimalistic, light theme with custom colors.
*/

const COLORS = {
  primary: "#1976D2",
  secondary: "#424242",
  accent: "#FFC107",
  boardBg: "#fff",
  cellBg: "#f8f9fa",
  cellBorder: "#e9ecef",
  playerX: "#1976D2",
  playerO: "#FFC107",
  text: "#2d2d2d",
  tie: "#9e9e9e"
};

// Determine winner or if tie.
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8], // rows
    [0, 3, 6],[1, 4, 7],[2, 5, 8], // cols
    [0, 4, 8],[2, 4, 6] // diags
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }
  // If no nulls, and no winner, it's a tie
  if (squares.every(Boolean)) return "tie";
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State for the game
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState({ winner: null, isTie: false });

  useEffect(() => {
    const winner = calculateWinner(squares);
    setStatus({
      winner: winner === "tie" ? null : winner,
      isTie: winner === "tie"
    });
  }, [squares]);

  // Handle click on cell
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || status.winner || status.isTie) return;
    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((x) => !x);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Derive UI status
  let gameStatusStr = "";
  let statusColor = COLORS.text;
  if (status.winner) {
    gameStatusStr = `Player ${status.winner} wins! 🎉`;
    statusColor = status.winner === "X" ? COLORS.playerX : COLORS.playerO;
  } else if (status.isTie) {
    gameStatusStr = "It's a tie! 🤝";
    statusColor = COLORS.tie;
  } else {
    gameStatusStr = `Player ${xIsNext ? "X" : "O"}'s turn`;
    statusColor = xIsNext ? COLORS.playerX : COLORS.playerO;
  }

  return (
    <div className="ttt-root">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <TicTacToeBoard
          squares={squares}
          onCellClick={handleClick}
          winner={status.winner}
          isTie={status.isTie}
        />
        <div className="ttt-status" style={{ color: statusColor }}>
          {gameStatusStr}
        </div>
        <button className="ttt-restart-btn" onClick={handleRestart}>
          Restart Game
        </button>
        <div className="ttt-info">
          <span>
            <span className="legend-x" /> Player X
          </span>
          <span>
            <span className="legend-o" /> Player O
          </span>
        </div>
      </div>
      <footer className="ttt-footer">
        <span>
          Modern minimal design – Colors: Primary <span style={{color: COLORS.primary}}>■</span>,
          Accent <span style={{color: COLORS.accent}}>■</span>,
          Secondary <span style={{color: COLORS.secondary}}>■</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({ squares, onCellClick, winner, isTie }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {squares.map((square, idx) => (
        <button
          key={idx}
          className="ttt-cell"
          aria-label={`Cell ${idx + 1}: ${square ? square : "empty"}`}
          disabled={!!square || !!winner || isTie}
          onClick={() => onCellClick(idx)}
          tabIndex={0}
        >
          {square === "X" && (
            <span className="ttt-x">X</span>
          )}
          {square === "O" && (
            <span className="ttt-o">O</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default App;
