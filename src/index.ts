import './styles/styles.scss';

import { Game } from './packages';

const game = new Game(document.getElementById('canvas') as HTMLCanvasElement);

const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');

pauseButton.addEventListener('click', () => {
  game.pause();
  pauseButton.style.display = 'none';
  playButton.style.display = 'block';
});

playButton.addEventListener('click', () => {
  game.play();
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
});

game.init();
