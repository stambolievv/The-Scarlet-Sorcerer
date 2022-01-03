export default class Perk {
    constructor(data, position) {
        this.prop = data.prop;
        this.sprite = data.sprite;
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: 24, h: 24 };
        this.type = this.prop.variety[Math.floor(Math.random() * this.prop.variety.length)];
        this.theta = 0;
    }

    draw(ctx, elapsed) {

        const position = Math.floor(elapsed * 0.01) % this.prop.animations[this.type.name].loc.length;
        const frameX = this.prop.animations[this.type.name].loc[position].x;
        const frameY = this.prop.animations[this.type.name].loc[position].y;

        ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x, this.pos.y, this.prop.frameWidth, this.prop.frameHeight);

        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.type.color;
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.closePath();
        }
    }

    update() {
        this.theta += Math.PI / 60;
        const scale = Math.sin(this.theta);
        this.pos.y += scale * 0.5;
    }
}