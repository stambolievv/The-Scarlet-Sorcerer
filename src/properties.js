import data from './data/asset-pack.js';
import loadFiles from './preload.js';
import createTimer from './util/Timer.js';

const gameSettings = {
  timer: new createTimer(),
  masterVolume: 0.1,
  scorePoints: 0,
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