import { createGame, makeMove } from './game.js';

const boardEl = document.getElementById('board');
const cells = [...boardEl.querySelectorAll('.cell')];
const statusEl = document.getElementById('status');
const newRoundBtn = document.getElementById('new-round');
const resetScoreBtn = document.getElementById('reset-score');
const scoreEls = {
  X: document.getElementById('score-x'),
  O: document.getElementById('score-o'),
  draw: document.getElementById('score-draw'),
};

const SCORE_KEY = 'tictactoe.score';
const emptyScore = () => ({ X: 0, O: 0, draw: 0 });

// localStorage can throw (private mode, blocked storage), so the game works without it.
function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem(SCORE_KEY));
    const score = emptyScore();
    for (const k of Object.keys(score)) {
      if (Number.isInteger(saved?.[k]) && saved[k] >= 0) score[k] = saved[k];
    }
    return score;
  } catch {
    return emptyScore();
  }
}

function saveScore() {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch {
    /* ignore */
  }
}

let game = createGame();
let score = loadScore();

function renderScore() {
  for (const [k, el] of Object.entries(scoreEls)) el.textContent = score[k];
}

const markSpan = (mark) => `<span class="mark-${mark.toLowerCase()}">${mark}</span>`;

function render() {
  const over = Boolean(game.winner) || game.isDraw;

  cells.forEach((cell, i) => {
    const mark = game.board[i];
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    cell.textContent = mark ?? '';
    cell.classList.toggle('x', mark === 'X');
    cell.classList.toggle('o', mark === 'O');
    cell.classList.toggle('win', Boolean(game.winLine?.includes(i)));
    cell.disabled = Boolean(mark) || over;
    cell.setAttribute('aria-label', `Row ${row}, column ${col}, ${mark ?? 'empty'}`);
  });

  if (game.winner) statusEl.innerHTML = `${markSpan(game.winner)} wins!`;
  else if (game.isDraw) statusEl.textContent = "It's a draw";
  else statusEl.innerHTML = `${markSpan(game.turn)} to move`;
}

boardEl.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const next = makeMove(game, Number(cell.dataset.index));
  if (next === game) return;
  game = next;
  if (game.winner || game.isDraw) {
    score[game.winner ?? 'draw'] += 1;
    saveScore();
    renderScore();
  }
  render();
});

newRoundBtn.addEventListener('click', () => {
  game = createGame();
  render();
});

resetScoreBtn.addEventListener('click', () => {
  score = emptyScore();
  saveScore();
  renderScore();
});

renderScore();
render();
