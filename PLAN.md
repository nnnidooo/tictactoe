# Tic-Tac-Toe — Plan

## Goal
A browser tic-tac-toe game for two players on one device, with a running score and unit-tested game logic. Plain HTML/CSS/JS, no build step: open `index.html` and play.

## Scope
- 3×3 board. X always moves first.
- Players take turns clicking empty cells.
- A win (row, column or diagonal) or a full board ends the round, and the winning line is highlighted.
- A status line shows whose turn it is, then the result.
- Score tracking: X wins, O wins and draws. The score lasts across rounds and is saved in `localStorage` so it survives a page reload.
- Buttons: **New round** (clears the board, keeps the score) and **Reset score**.
- Out of scope: computer opponent, online play, undo.

## File layout
```
tictactoe/
├── index.html        # markup: board, status line, scoreboard, buttons
├── style.css         # layout and styling, responsive, light and dark mode
├── src/
│   ├── game.js       # pure game logic (no DOM): state, moves, win and draw checks
│   └── main.js       # UI: renders state, handles clicks, keeps the score
├── test/
│   └── game.test.js  # unit tests for game.js (node:test)
├── package.json      # "type": "module", "test": "node --test"
├── README.md
└── .gitignore
```

## Design
**`src/game.js` (pure functions, easy to test)**
- `createGame()` returns `{ board: Array(9).fill(null), turn: 'X', winner: null, winLine: null, isDraw: false }`
- `makeMove(state, index)` returns a **new** state. An illegal move (cell taken, game over, index out of range) returns the state unchanged.
- `getWinner(board)` returns `{ winner, line }` or `null`, checking the 8 winning lines.
- `isDraw(board)`: the board is full and nobody has won.

**`src/main.js` (UI)**
- Keeps the current game state and the score.
- One click handler on the board (event delegation) calls `makeMove`, re-renders and updates the score when a round ends.
- Cells are `<button>`s so keyboard and screen-reader users can play. The status line uses `aria-live`.
- Loaded as an ES module (`<script type="module">`).

> Note: browsers block ES module imports over `file://`, so the README will say to run a tiny local server (`npx serve` or `python3 -m http.server`).

## Tests (`npm test`, Node's built-in test runner)
- A new game has an empty board and X to move.
- Moves alternate X and O.
- A move on a taken cell, or after the game ends, does nothing.
- All 8 winning lines are detected, with the correct `winLine`.
- Draw detection: a full board with no winner.
- A win on the last move counts as a win, not a draw.
- `makeMove` does not change the state passed in.

## Build order (one commit each)
1. Scaffold: `package.json`, `.gitignore`, `README.md`
2. `game.js` and its tests (tests first, then make them pass)
3. `index.html` and `style.css`: static board and layout
4. `main.js`: wire up gameplay
5. Scoreboard and `localStorage`, plus the New round and Reset score buttons
6. Polish: winning-line highlight, hover and focus states, mobile check
