import data from './data/asset-pack.js';
import loadFiles from './preload.js';
import createTimer from './util/Timer.js';

const gameSettings = {
  state: 'playing',
  mouse: { x: 0, y: 0, pressed: false },
  keyboard: new Set(),
  timer: new createTimer(),
  scorePoints: 0,
  masterVolume: 0.1,
};
const { gui, background, images, audio } = loadFiles(data);
const spritesheets = data.spritesheets;

export {
  gameSettings,
  gui,
  background,
  images,
  audio,
  spritesheets,
};