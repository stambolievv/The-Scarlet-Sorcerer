export default class FloatingMessage {
    constructor(text, position, fixed, size, color) {
        this.text = text;
        this.pos = { x: position.x, y: position.y };
        this.fixed = fixed;
        this.size = size;
        this.color = color;
        this.lifeSpan = 0;
        this.opacity = 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.font = this.size + 'px customFont';
        ctx.fillText(this.text, this.pos.x, this.pos.y);
        ctx.restore();
    }

    update() {
        this.pos.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.01) { this.opacity -= 0.005; }
    }
}