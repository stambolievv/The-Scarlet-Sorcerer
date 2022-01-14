import { GAME, ASSETS } from './properties.js';
import { players } from './constants.js';
import { platformsAnimation } from './entities/platform.js';
import { playerAnimation } from './entities/player.js';
import { enemiesAnimation } from './entities/enemy.js';
import { projectileFire, projectilesAnimation } from './entities/projectile.js';
import { perkAnimation } from './entities/perk.js';
import { guiAnimation } from './util/GUI.js';
import { floatingMessages } from './util/floatingMessage.js';
import tick from './util/fps.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
canvas.width = GAME.WIDTH;
canvas.height = GAME.HEIGHT;

const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

let lastTime = 0;

ASSETS.audio.background.play();

function animate(timestamp) {
  requestAnimationFrame(animate);

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  soundVolume(ASSETS.audio, GAME.VOLUME, !GAME.FOCUS || GAME.GAMEOVER);

  if (!GAME.FOCUS) { return; }

  backgroundParallax(ASSETS.background);
  platformsAnimation(ctx);
  tick(ctx, deltaTime);
  guiAnimation(ctx, deltaTime);

  if (!GAME.GAMEOVER) {
    playerAnimation(ctx, deltaTime);
    floatingMessages(ctx, deltaTime);
    perkAnimation(ctx, deltaTime);
    projectilesAnimation(ctx, deltaTime);
    enemiesAnimation(ctx, deltaTime);
  }
}

function backgroundParallax(background) {
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
      s.volume *= 0.3;
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
  GAME.MOUSE.x = e.offsetX;
  GAME.MOUSE.y = e.offsetY;
});
canvas.addEventListener('mousedown', (e) => {
  GAME.MOUSE.pressed = true;
  projectileFire(e);
});
canvas.addEventListener('mouseup', (e) => {
  GAME.MOUSE.pressed = false;
});
canvas.addEventListener('touchmove', (e) => {
  GAME.MOUSE.x = e.offsetX;
  GAME.MOUSE.y = e.offsetY;
});
canvas.addEventListener('touchstart', (e) => {
  GAME.MOUSE.pressed = true;
  projectileFire(e);
});
canvas.addEventListener('touchend', (e) => {
  GAME.MOUSE.pressed = false;
});
window.addEventListener('focus', () => {
  GAME.FOCUS = true;
});
window.addEventListener('blur', () => {
  GAME.FOCUS = false;
});
window.addEventListener('load', animate(0));