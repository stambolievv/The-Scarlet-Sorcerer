export default class Perk {
    constructor(position, type) {
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: 50, h: 50 };
        this.type = type;
        this.theta = 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.type.color;
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.theta += Math.PI / 60;
        const scale = Math.sin(this.theta);
        this.pos.y += scale * 0.2;
        this.dim.w += scale * 0.3;
        this.dim.h += scale * 0.3;
    }
}
