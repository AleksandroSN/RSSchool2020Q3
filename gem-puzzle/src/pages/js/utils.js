import /* Cells, */{ wrapper } from './cells';

export default class SubFunction {
  constructor() {
    this.create = this.createMenu();
    this.time = 0;
    this.init();
  }

  init() {
    this.createMenuListItem();
    this.createGameTimer();
    this.startGameTimer();
  }

  tempNewGame() {
    this.createMenu();
    this.createMenuListItem();
    this.createGameTimer();
    this.startGameTimer();
  }

  createMenu() {
    const menu = document.createElement('div');
    menu.classList.add('status-bar');
    const menuList = document.createElement('ul');
    menuList.classList.add('menu-list');
    wrapper.insertAdjacentElement('afterbegin', menu);
    menu.append(menuList);
    this.menu = menu;
    this.menuList = menuList;
    return this;
  }

  createMenuListItem() {
    const timer = document.createElement('li');
    timer.classList.add('menu-list__timer');
    timer.textContent = 'Time: 00:00';
    this.create.menuList.append(timer);
    this.timer = timer;

    const moves = document.createElement('li');
    moves.classList.add('menu-list__moves');
    moves.textContent = 'Turns: 0';
    this.create.menuList.append(moves);
    this.moves = moves;

    const submenu = document.createElement('li');
    submenu.classList.add('menu-list__submenu');
    submenu.textContent = 'New Game';
    this.create.menuList.append(submenu);
    this.submenu = submenu;
    return this;
  }

  createGameTimer() {
    const startTime = new Date(this.time * 1000);
    let sec = startTime.getSeconds();
    let min = startTime.getMinutes();

    sec = sec < 10 ? `0${sec}` : sec;

    min = min < 10 ? `0${min}` : min;

    document.querySelector('.menu-list__timer').textContent = `Time: ${min}:${sec}`;

    this.time += 1;
  }

  startGameTimer() {
    this.timer = setInterval(() => this.createGameTimer(), 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
    this.time = 0;
    document.querySelector('.menu-list__timer').textContent = 'Time: 00:00';
  }
}
