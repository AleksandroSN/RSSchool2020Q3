const body = document.querySelector('body');
const wrapper = document.createElement('div');
const gameContainer = document.createElement('div');
wrapper.classList.add('wrapper');
gameContainer.classList.add('game-container');
body.append(wrapper);
wrapper.append(gameContainer);

export default class Cells {
  constructor(name, top, left, width, height) {
    this.name = name;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.render();
    gameContainer.append(this.div);
  }

  div = document.createElement('div');

  render() {
    this.div.classList.add('cell');
    this.div.textContent = this.name;
    this.div.style.left = this.left;
    this.div.style.top = this.top;
    this.div.style.width = this.width;
    this.div.style.height = this.height;
  }
}

export { body, wrapper, gameContainer };
