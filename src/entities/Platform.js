export default class Platform {
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
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.font = 'bold 24px serif';
      ctx.fillText(this.tileValue, this.pos.x + this.dim.w / 2, this.pos.y + this.dim.h / 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
      ctx.closePath();
    }
  }
}