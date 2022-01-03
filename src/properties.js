import loadFiles from './preload.js';
import data from './data/asset-pack.js';
import createTimer from './models/Timer.js';

export const gameSettings = {
    timer: new createTimer(),
    masterVolume: 0,
    scorePoints: 0,
};
export const { gui, background, images, audio } = loadFiles(data);
export const spritesheets = data.spritesheets;
export const platforms = [];
export const players = [];
export const interfaces = [];
export const projectiles = [];
export const perks = [];
export const keysPressed = new Set();
export const enemies = [];
export const enemyStats = { speed: 2 };
export const textMessages = [];