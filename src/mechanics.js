import { GAME } from './properties.js';

/**
 * @param {Array} AA 
 * @param {Array} BB 
 * @param {Function} callback 
 */
function overlap(AA, BB, callback) {
  /*
  Collision detection with two different objects.
  By checking their sides points were : 
      top side is - pos.y
      left side is - pos.x
      bottom side is - pos.y + dim.h
      right side is - pos.x + dim.w
  Returns "a" and "b" if they touched, from "AA" and "BB" array.
  */
  AA.forEach(a => {
    BB.forEach(b => {
      if (a.pos.x < b.pos.x + b.dim.w && a.pos.x + a.dim.w > b.pos.x &&
        a.pos.y < b.pos.y + b.dim.h && a.pos.y + a.dim.h > b.pos.y) {
        return callback(a, b);
      }
    });
  });
}

/**
 * @param {Array} AA 
 * @param {Array} BB 
 * @returns {Object}
 */
function collision(AA, BB) {
  /* 
  ?---------------------------------------------+
  !                    ISSUE                    |
  !              Hours spent: >20               |
  ?---------------------------------------------+
  !     Whenever player right border is         |
  !     close to one of the platform            |
  !     left border and they collide            |
  !     when jump on it, player is moved        |
  !     to the left, flush with the border.     |
  !     Turn on DEBUG for easier visualization. |
  ?---------------------------------------------+
  !                   QUICK FIX:                |
  !          Math.ceil() on "crossWidth".       |
  !          If removed is getting worst.       |
  ?---------------------------------------------+
  */

  /*
  Collision detection with different side of objects.
  The "a" from "AA" array stop because "b" from "BB" array is immovable.
  */
  const side = { top: false, bottom: false, left: false, right: false, type: undefined };
  AA.forEach(a => {
    BB.forEach(b => {
      /* Check if its decoration block */
      if (a.decoration || b.decoration) { return; }

      /* Get the center distance for the two objects */
      const diffX = (a.pos.x + (a.dim.w / 2)) - (b.pos.x + (b.dim.w / 2));
      const diffY = (a.pos.y + (a.dim.h / 2)) - (b.pos.y + (b.dim.h / 2));

      /* Add the half widths and half heights of the objects. */
      const widthHalf = (a.dim.w / 2) + (b.dim.w / 2);
      const heightHalf = (a.dim.h / 2) + (b.dim.h / 2);

      /* If the "x" and "y" vector are less than the half width or half height, they we must be inside the object, causing a collision. */
      if (Math.abs(diffX) < widthHalf && Math.abs(diffY) < heightHalf) {

        /* Figures out on which side we are colliding (top, bottom, left, or right). */
        const crossWidth = Math.ceil(widthHalf - Math.abs(diffX));
        const crossHeight = heightHalf - Math.abs(diffY);

        /* Pass the value of the tile to check if its painful or not. */
        side.type = a.tileValue || b.tileValue;

        if (crossWidth > crossHeight) {
          if (diffY > 0) {
            side.top = true;
            a.pos.y += crossHeight;
          } else {
            side.bottom = true;
            a.pos.y -= crossHeight;
          }
        }
        if (crossWidth < crossHeight) {
          if (diffX > 0) {
            side.left = true;
            a.pos.x += crossWidth;
          } else {
            side.right = true;
            a.pos.x -= crossWidth;
          }
        }
      }
    });
  });
  return side;
}

/**
 * @param {Array} AA 
 */
function removeWorldOutBounds(AA) {
  /*
  Collision detection with outside world boundaries,
  By checking their sides points were : 
       top side is - pos.y
      left side is - pos.x
      bottom side is - pos.y + dim.h
      right side is - pos.x + dim.w
  If "a" from "AA" array goes out of screen will be deleted.
  */
  AA.forEach((a, i) => {
    if (a.pos.x + a.dim.w < 0 || a.pos.x > GAME.WIDTH ||
      a.pos.y + a.dim.h < 0 || a.pos.y > GAME.HEIGHT) {
      AA.splice(i, 1);
    }
  });
}

/**
 * @param {Array} AA 
 * @returns {Object}
 */
function collideWorldBounds(AA) {
  /*
  Collision detection with the world boundaries.
  By checking their sides points were : 
      top side is - pos.y
      left side is - pos.x
      bottom side is - pos.y + dim.h
      right side is - pos.x + dim.w
  The "a" from "AA" array can't leave the screen.
  */
  const side = { top: false, bottom: false, left: false, right: false };
  AA.forEach(a => {
    if (a.pos.y < 0) {
      side.top = true;
      a.pos.y = 0;
      a.vel.y = 0;
    }
    if (a.pos.y + a.dim.h > GAME.HEIGHT) {
      side.bottom = true;
      a.pos.y = GAME.HEIGHT - a.dim.h;
      a.vel.y = 0;
    }
    if (a.pos.x < 0) {
      side.left = true;
      a.pos.x = 0;
      a.vel.x = 0;
    }
    if (a.pos.x + a.dim.w > GAME.WIDTH) {
      side.right = true;
      a.pos.x = GAME.WIDTH - a.dim.w;
      a.vel.x = 0;
    }
  });
  return side;
}

/**
 * @param {Number} posX 
 * @param {Number} posY 
 * @returns {Object}
 */
function relativePosition(posX, posY) {
  return { x: posX * GAME.WIDTH, y: posY * GAME.HEIGHT };
}

/**
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export {
  overlap,
  collision,
  removeWorldOutBounds,
  collideWorldBounds,
  relativePosition,
  random,
};