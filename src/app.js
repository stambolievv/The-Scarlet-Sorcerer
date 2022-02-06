import { GAME, ASSETS } from './properties.js';
import { players } from './constants.js';
import { platformsAnimation } from './entities/platform.js';
import { playerAnimation } from './entities/player.js';
import { enemiesAnimation } from './entities/enemy.js';
import { projectileFire, projectilesAnimation } from './entities/projectile.js';
import { perkAnimation } from './entities/perk.js';
import { guiComponents } from './util/GUI.js';
import { floatingMessages } from './util/floatingMessage.js';
import { particlesAnimation } from './util/particle.js';
import tick from './util/fps.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
canvas.width = GAME.WIDTH;
canvas.height = GAME.HEIGHT;

const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

let lastTime = 0;

function animate(timestamp) {
  requestAnimationFrame(animate);

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  soundVolume(ASSETS.audio, GAME.VOLUME, GAME.MUTE);

  backgroundParallax(ctx, ASSETS.background);
  platformsAnimation(ctx);
  floatingMessages(ctx, deltaTime);
  tick(ctx, deltaTime);
  guiComponents(ctx, deltaTime);

  if (!GAME.GAMEOVER && !GAME.PAUSE) {
    playerAnimation(ctx, deltaTime);
    perkAnimation(ctx, deltaTime);
    projectilesAnimation(ctx, deltaTime);
    enemiesAnimation(ctx, deltaTime);
    particlesAnimation(ctx, deltaTime);
  }
}

function backgroundParallax(ctx, background) {
  Object.values(background).forEach(layer => {
    const posX = layer.moving ? (Math.round(players[0].pos.x * -0.1)) : 0;
    ctx.drawImage(layer, posX, 0, layer.width, layer.height);
  });
}
function soundVolume(sounds, masterVolume, pause) {
  Object.values(sounds).forEach(s => {
    s.volume = masterVolume;
    if (s.loop) {
      if (pause) { return s.pause(); }
      s.volume *= 0.2;
      s.play();
    }
  });
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
  const screen = canvas.getBoundingClientRect();

  GAME.MOUSE.x = (e.clientX - screen.left) / (screen.right - screen.left) * canvas.width;
  GAME.MOUSE.y = (e.clientY - screen.top) / (screen.bottom - screen.top) * canvas.height;
});
canvas.addEventListener('mousedown', (e) => {
  GAME.MOUSE.pressed = true;
  projectileFire();
});
canvas.addEventListener('mouseup', (e) => {
  GAME.MOUSE.pressed = false;
});
//! COMING SOON ↓
// canvas.addEventListener('touchmove', (e) => {
// });
// canvas.addEventListener('touchstart', (e) => {
//   GAME.MOUSE.pressed = true;                  
// });
// canvas.addEventListener('touchend', (e) => {
//   GAME.MOUSE.pressed = false;
// });
//! COMING SOON ↑
//? optional ↓
// window.addEventListener('focus', () => {
//   if (!GAME.GAMEOVER) { GAME.PAUSE = false; }
// });
window.addEventListener('blur', () => {
  if (!GAME.GAMEOVER) { GAME.PAUSE = true; }
});
window.addEventListener('load', animate(0));