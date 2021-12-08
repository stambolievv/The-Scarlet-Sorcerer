export default class Platform {
    constructor(position, width, height, length, type) {
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: width * length, h: height };
        this.type = type;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'hsl(10, 50%, 50%, 0.5)';
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }
}