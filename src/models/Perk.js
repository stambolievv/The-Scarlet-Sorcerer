export default class Perk {
    constructor(data, sprite, position) {
        this.data = data;
        this.sprite = sprite;
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: 24, h: 24 };
        this.type = this.data.variety[Math.floor(Math.random() * this.data.variety.length)];
        this.theta = 0;
        this.gameFrame = 0;
    }

    draw(ctx) {

        const position = Math.floor(this.gameFrame / 15) % this.data.animations[this.type.name].loc.length;
        const frameX = this.data.animations[this.type.name].loc[position].x;
        const frameY = this.data.animations[this.type.name].loc[position].y;

        ctx.drawImage(this.sprite, frameX, frameY, this.data.frameWidth, this.data.frameHeight, this.pos.x, this.pos.y, this.data.frameWidth, this.data.frameHeight);

        this.gameFrame++;

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