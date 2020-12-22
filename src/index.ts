import './styles/styles.scss';

import { Game } from './packages';

const game = new Game(document.getElementById('canvas') as HTMLCanvasElement);

const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const clearButton = document.getElementById('clear');

pauseButton.addEventListener('click', () => {
  game.pause();
  pauseButton.style.display = 'none';
  playButton.style.display = 'inline-block';
});

playButton.addEventListener('click', () => {
  game.play();
  playButton.style.display = 'none';
  pauseButton.style.display = 'inline-block';
});

clearButton.addEventListener('click', () => {
  game.clear();
  pauseButton.style.display = 'none';
  playButton.style.display = 'inline-block';
});

game.init();
