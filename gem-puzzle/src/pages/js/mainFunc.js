import Cells from './cells';

export default class Puzzle {
  constructor() {
    this.cellsArr = [];
    this.allTiles = [];
    this.init();
    this.audio = new Audio();
  }

  arrayNumbers = ['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  init() {
    this.createPuzzle();
    // console.log(this.cellsArr);
    this.move();
    this.countMove = 0;
  }

  createPuzzle() {
    const cellSize = 25;
    this.shuffle();
    this.arrayNumbers.forEach((elem, index) => {
      const left = (index % 4) * cellSize;
      // console.log(left);
      const top = ((index - left / cellSize) / 4) * cellSize;
      // console.log(top);
      this.cellsArr.push(new Cells(elem, `${top}%`, `${left}%`, `${cellSize}%`, `${cellSize}%`));
    });
  }

  // resizePuzzle() {
  //   const screenWidth = window.innerWidth;
  //   if (screenWidth < 600) {
  //     this.createPuzzle(70);
  //   } else this.createPuzzle(100);
  // }

  CountMove() {
    const turns = document.querySelector('.menu-list__moves');
    this.countMove += 1;
    turns.textContent = `Turns: ${this.countMove}`;
    // console.log(this.countMove);
  }

  reZeroCounterMove() {
    const turns = document.querySelector('.menu-list__moves');
    this.countMove = 0;
    turns.textContent = `Turns: ${this.countMove}`;
  }

  move() {
    this.allTiles = document.querySelectorAll('.cell');
    // console.log(this.allTiles);
    // console.log(this.allTiles.forEach((i) => console.log(i.innerText)));
    let emptyCell;
    // let emptyCellIndex;
    this.allTiles.forEach((elem /* , index */) => {
      if (elem.textContent === '') {
        emptyCell = elem;
        // emptyCellIndex = index;
      }
      elem.addEventListener('click', (evt) => {
        const item = elem;
        if (evt.target !== emptyCell) {
          const diffLeft = Math.abs(emptyCell.offsetLeft - item.offsetLeft);
          const diffTop = Math.abs(emptyCell.offsetTop - item.offsetTop);

          if (diffLeft + diffTop > 110) {
            return;
          }
          // console.log(this.cellsArr[index]);
          // console.log(this.cellsArr[emptyCellIndex]);

          this.CountMove();
          this.playSound();
          const tempLeft = emptyCell.style.left;
          const tempTop = emptyCell.style.top;

          emptyCell.style.left = item.style.left;
          emptyCell.style.top = item.style.top;

          item.style.left = tempLeft;
          item.style.top = tempTop;

          // [this.allTiles[index],
          // eslint-disable-next-line max-len
          //   this.allTiles[emptyCellIndex]] = [this.allTiles[emptyCellIndex], this.allTiles[index]];
          // console.log(this.cellsArr[index]);
          // console.log(this.cellsArr[emptyCellIndex]);
          // console.log(this.allTiles.forEach((i) => console.log(i.innerText)));
        }
      });
    });
  }

  shuffle() {
    for (let i = this.arrayNumbers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.arrayNumbers[i], this.arrayNumbers[j]] = [this.arrayNumbers[j], this.arrayNumbers[i]];
    }
  }

  // save() {

  // }

  playSound() {
    this.sound = new Audio('./assets/sounds/sound.mp3');
    this.sound.volume = 0.7;
    this.sound.play();
  }
}
