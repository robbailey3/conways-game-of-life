import './styles/styles.scss';

import { Game } from './packages';

const game = new Game(document.getElementById('canvas') as HTMLCanvasElement);

document.getElementById('pause').addEventListener('click', () => {
  game.pause();
});
document.getElementById('play').addEventListener('click', () => {
  game.play();
});

game.init();
