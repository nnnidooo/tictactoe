# Tic-Tac-Toe

Two-player tic-tac-toe in the browser, with a running score that survives page reloads.

## Play

The game uses ES modules, which browsers won't load from `file://`, so serve the folder locally:

```sh
npm start            # runs: python3 -m http.server 8000
# or: npx serve
```

Then open <http://localhost:8000>.

## Test

```sh
npm test
```

Uses Node's built-in test runner (Node 16.17+), so there's nothing to install.

## Layout

- `src/game.js`: pure game logic (no DOM)
- `src/main.js`: UI: rendering, clicks, score
- `test/game.test.js`: unit tests for the game logic
