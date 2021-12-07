import { ctx } from '../app.js';
export default class Projectiles {
    constructor(parent, speed, angle) {
        this.dim = { w: parent.dim.w / 2, h: parent.dim.w / 2 };
        this.pos = { x: parent.pos.x + parent.dim.w * 0.25, y: parent.pos.y + parent.dim.h * 0.25 };
        this.vel = { x: speed, y: speed };
        this.angle = angle;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'hsl(35, 100%, 50%, 0.3)';
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        this.pos.x += this.vel.x * Math.cos(this.angle);
        this.pos.y += this.vel.y * Math.sin(this.angle);
    }
}