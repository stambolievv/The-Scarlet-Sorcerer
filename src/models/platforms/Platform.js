import { ctx } from '../../app.js';

export default class Platform {
    constructor(x, y, width, height, length, type) {
        this.pos = { x: x * ctx.canvas.width, y: y * ctx.canvas.height };
        this.dim = { w: width * length, h: height };
        this.type = type;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'hsl(10, 50%, 50%, 0.5)';
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }
}