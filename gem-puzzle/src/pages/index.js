import { gameContainer, wrapper } from './js/cells';
import Puzzle from './js/mainFunc';
import SubFunction from './js/utils';
import './sass/main.scss';

const PuzzleLis = new Puzzle();
const subFunction2 = new SubFunction();

// eslint-disable-next-line no-console
window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-unused-expressions
  subFunction2;
  // eslint-disable-next-line no-unused-expressions
  PuzzleLis;
});

const newGame = document.querySelector('.menu-list__submenu');

newGame.addEventListener('click', (evt) => {
  evt.preventDefault();
  // eslint-disable-next-line no-unused-expressions
  const cells = document.querySelectorAll('.cell');
  cells.forEach((elem) => elem.remove());
  gameContainer.remove();
  PuzzleLis.cellsArr = [];
  wrapper.append(gameContainer);
  PuzzleLis.reZeroCounterMove();
  PuzzleLis.createPuzzle();
  subFunction2.startGameTimer();
  subFunction2.stopGameTimer();
  setTimeout(() => PuzzleLis.move(), 100);
});
