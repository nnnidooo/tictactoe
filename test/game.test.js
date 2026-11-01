import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, makeMove, getWinner, isDraw, WIN_LINES } from '../src/game.js';

const play = (moves) => moves.reduce((s, i) => makeMove(s, i), createGame());

test('new game has an empty board and X to move', () => {
  const g = createGame();
  assert.deepEqual(g.board, Array(9).fill(null));
  assert.equal(g.turn, 'X');
  assert.equal(g.winner, null);
  assert.equal(g.winLine, null);
  assert.equal(g.isDraw, false);
});

test('moves alternate between X and O', () => {
  const g = play([0, 4]);
  assert.equal(g.board[0], 'X');
  assert.equal(g.board[4], 'O');
  assert.equal(g.turn, 'X');
});

test('move on a taken cell is ignored', () => {
  const g = play([0]);
  assert.equal(makeMove(g, 0), g);
});

test('out-of-range or non-integer index is ignored', () => {
  const g = createGame();
  for (const i of [-1, 9, 1.5, '3', undefined]) assert.equal(makeMove(g, i), g);
});

test('moves after the game is over are ignored', () => {
  const g = play([0, 3, 1, 4, 2]); // X wins top row
  assert.equal(g.winner, 'X');
  assert.equal(makeMove(g, 8), g);
});

test('detects all 8 winning lines', () => {
  assert.equal(WIN_LINES.length, 8);
  for (const line of WIN_LINES) {
    const board = Array(9).fill(null);
    for (const i of line) board[i] = 'O';
    assert.deepEqual(getWinner(board), { winner: 'O', line });
  }
});

test('getWinner returns null when no one has won', () => {
  assert.equal(getWinner(Array(9).fill(null)), null);
  assert.equal(getWinner(['X', 'O', 'X', null, null, null, null, null, null]), null);
});

test('game state records winner and winning line', () => {
  const g = play([0, 1, 4, 2, 8]); // X diagonal 0-4-8
  assert.equal(g.winner, 'X');
  assert.deepEqual(g.winLine, [0, 4, 8]);
  assert.equal(g.isDraw, false);
});

test('full board with no winner is a draw', () => {
  // X O X / X O O / O X X
  const g = play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
  assert.equal(g.winner, null);
  assert.equal(g.isDraw, true);
  assert.equal(isDraw(g.board), true);
});

test('a win on the last move counts as a win, not a draw', () => {
  // X O X / O X O / O X X  -> X fills 8 completing 0-4-8
  const g = play([0, 1, 2, 3, 4, 5, 7, 6, 8]);
  assert.equal(g.winner, 'X');
  assert.equal(g.isDraw, false);
  assert.equal(isDraw(g.board), false);
});

test('makeMove does not mutate the input state', () => {
  const g = createGame();
  const snapshot = JSON.parse(JSON.stringify(g));
  makeMove(g, 4);
  assert.deepEqual(g, snapshot);
});
