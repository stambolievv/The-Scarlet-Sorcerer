import { GAME, ASSETS, DATA } from '../properties.js';
import { platforms } from '../constants.js';

class Platform {
  constructor(tilesheet, sourceX, sourceY, destinationX, destinationY, frameWidth, frameHeight, tileValue) {
    this.sprite = tilesheet;
    this.src = { x: sourceX, y: sourceY };
    this.pos = { x: destinationX, y: destinationY };
    this.dim = { w: frameWidth, h: frameHeight };
    this.tileValue = tileValue;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.src.x, this.src.y, this.dim.w, this.dim.h, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

    if (ctx.DEBUG) {
      ctx.fillStyle = 'yellow';
      ctx.strokeStyle = 'black';
      ctx.fillText(this.tileValue, this.pos.x + this.dim.w / 2, this.pos.y + this.dim.h / 2);
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }
}

(function create() {
  const tileset = DATA.tileset;

  for (let index = tileset.map.length - 1; index > -1; --index) {

    /* Get the value of each tile in the map which corresponds to the tile
    graphic index in the tileset. */
    const tileValue = tileset.map[index];

    /* If value of the tile the tile is in the ignore array skip it */
    if (tileset.ignoreFrame.includes(tileValue)) { continue; }

    /* This is the "x" and "y" location at which to cut the tile
    image out of the tileset. */
    const sourceX = (tileValue % tileset.columns) * tileset.frameWidth;
    const sourceY = Math.floor(tileValue / tileset.columns) * tileset.frameHeight;

    /* This is the "x" and "y" location at which to draw the tile image we are cutting
    from the tileset to the canvas. */
    const destinationX = (index % Math.round(GAME.WIDTH / tileset.frameWidth)) * tileset.frameWidth;
    const destinationY = Math.floor(index / Math.round(GAME.WIDTH / tileset.frameWidth)) * tileset.frameHeight;

    platforms.push(new Platform(ASSETS.images.tileset, sourceX, sourceY, destinationX, destinationY, tileset.frameWidth, tileset.frameHeight, tileValue));
  }
})();

function platformsAnimation(ctx) {
  platforms.forEach(p => {
    p.draw(ctx);
  });
}

export {
  platformsAnimation
};