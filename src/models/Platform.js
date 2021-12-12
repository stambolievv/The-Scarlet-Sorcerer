export default class Platform {
    constructor(position, width, height, length, type) {
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: width * length, h: height };
        this.type = type;
    }

    draw(ctx) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, 'LightGreen');
        gradient.addColorStop(1, 'DarkGreen');
        ctx.fillStyle = gradient;
        // ctx.fillStyle = 'hsl(10, 50%, 50%, 0.5)';
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }
}