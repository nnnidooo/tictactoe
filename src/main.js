import { createGame, makeMove } from './game.js';

const boardEl = document.getElementById('board');
const cells = [...boardEl.querySelectorAll('.cell')];
const statusEl = document.getElementById('status');
const newRoundBtn = document.getElementById('new-round');

let game = createGame();

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
  render();
});

newRoundBtn.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
