import data from './data/asset-pack.js';
import loadFiles from './preload.js';
import createTimer from './util/Timer.js';

const GAME = {
  WIDTH: 1296,
  HEIGHT: 720,
  FOCUS: true,
  DEBUG: false,
  MOUSE: { x: 0, y: 0, pressed: false, onMenu: false },
  KEYBOARD: new Set(),
  TIMER: new createTimer(),
  VOLUME: 0.5,
  SCORE: 0,
  HIGHSCORE: Number(localStorage.getItem('tss-highscore')) || 0,
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