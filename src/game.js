// Pure tic-tac-toe logic. No DOM access, so it can be unit-tested in Node.
// Board cells are indexed 0-8, left to right, top to bottom.

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export function createGame() {
  return { board: Array(9).fill(null), turn: 'X', winner: null, winLine: null, isDraw: false };
}

export function getWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export function isDraw(board) {
  return board.every(Boolean) && !getWinner(board);
}

// Returns a new state; illegal moves return the same state object unchanged.
export function makeMove(state, index) {
  const legal =
    Number.isInteger(index) && index >= 0 && index < 9 &&
    !state.board[index] && !state.winner && !state.isDraw;
  if (!legal) return state;

  const board = state.board.slice();
  board[index] = state.turn;
  const result = getWinner(board);

  return {
    board,
    turn: state.turn === 'X' ? 'O' : 'X',
    winner: result ? result.winner : null,
    winLine: result ? result.line : null,
    isDraw: !result && board.every(Boolean),
  };
}
