import { ctx } from './app.js';
export default class FloatingMessage {
    constructor(text, x, y, font = '', size = 18, color = 'white') {
        this.text = text;
        this.x = x * ctx.canvas.width;
        this.y = y * ctx.canvas.height;
        this.font = font;
        this.size = size;
        this.color = color;
        this.lifeSpan = 0;
        this.opacity = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.font = this.size + 'px ' + this.font;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.01) { this.opacity -= 0.01; }
    }
}