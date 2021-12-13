export default class Platform {
    constructor(tilesheet, sourceX, sourceY, destinationX, destinationY, frameWidth, frameHeight) {
        this.sprite = tilesheet;
        this.src = { x: sourceX, y: sourceY };
        this.pos = { x: destinationX, y: destinationY };
        this.dim = { w: frameWidth, h: frameHeight };
    }

    draw(ctx) {

        ctx.drawImage(this.sprite, this.src.x, this.src.y, this.dim.w, this.dim.h, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.fill();
            ctx.closePath();
        }
    }
}