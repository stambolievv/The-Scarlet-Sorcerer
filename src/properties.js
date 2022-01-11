import data from './data/asset-pack.js';
import loadFiles from './preload.js';
import createTimer from './util/Timer.js';

const GAME = {
  WIDTH: 1296,
  HEIGHT: 720,
  FOCUS: true,
  MOUSE: { x: 0, y: 0, pressed: false },
  KEYBOARD: new Set(),
  DEBUG: false,
  TIMER: new createTimer(),
  SCORE: 0,
  VOLUME: 0.5,
  GAMEOVER: false,
  showFps: false,
  showStats: false,
  immortal: false
};
const ASSETS = loadFiles(data);
const DATA = data.spritesheets;

export {
  GAME,
  ASSETS,
  DATA,
};