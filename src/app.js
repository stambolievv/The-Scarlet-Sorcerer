import { GAME, ASSETS } from '/src/properties.js';
import { players } from '/src/constants.js';
import { platformsAnimation } from '/src/entities/platform.js';
import { playerAnimation } from '/src/entities/player.js';
import { enemiesAnimation } from '/src/entities/enemy.js';
import { projectileFire, projectilesAnimation } from '../src/entities/projectile.js';
import { perkAnimation } from '/src/entities/perk.js';
import { guiAnimation } from '/src/util/GUI.js';
import { floatingMessages } from '/src/util/floatingMessage.js';
import tick from '/src/util/fps.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
canvas.width = GAME.WIDTH;
canvas.height = GAME.HEIGHT;

const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;
ctx.DEBUG = false; // fps, hitboxes and stuff

let lastTime = 0;
let elapsed = 0;

ASSETS.audio.background.play();

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  elapsed += deltaTime;

  backgroundParallax(ASSETS.background);
  platformsAnimation(ctx);
  playerAnimation(ctx, elapsed);
  enemiesAnimation(ctx, elapsed);
  projectilesAnimation(ctx, elapsed);
  perkAnimation(ctx, elapsed);
  floatingMessages(ctx);
  guiAnimation(ctx);
  soundVolume(ASSETS.audio, GAME.VOLUME);
  tick(ctx, elapsed);

  requestAnimationFrame(animate);
}

function backgroundParallax(background) {
  Object.values(background).forEach(layer => {
    const posX = layer.moving ? (Math.round(players[0].pos.x * -0.1)) : 0;
    ctx.drawImage(layer, posX, 0, layer.width, layer.height);
  });
}

function soundVolume(sounds, masterVolume) {
  Object.values(sounds).forEach(s => s.volume = masterVolume);
}


//?    /////////////////////////
//?   //// EVENT LISTENERS ////
//?  /////////////////////////

window.addEventListener('keydown', (e) => {
  GAME.KEYBOARD.add(e.code);
});
window.addEventListener('keyup', (e) => {
  GAME.KEYBOARD.delete(e.code);
});
canvas.addEventListener('mousemove', (e) => {
  GAME.MOUSE.x = e.offsetX || e.layerX;
  GAME.MOUSE.y = e.offsetY || e.layerY;
});
canvas.addEventListener('mousedown', (e) => {
  GAME.MOUSE.pressed = true;
  projectileFire(e);
});
canvas.addEventListener('mouseup', (e) => {
  GAME.MOUSE.pressed = false;
});
window.addEventListener('load', animate(0));