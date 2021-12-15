export default class Projectiles {
    constructor(data, sprite, parent, angle) {
        this.data = data;
        this.sprite = sprite;
        this.pos = { x: parent.pos.x + parent.dim.w / 4, y: parent.pos.y - parent.dim.h / 4 };
        this.vel = { x: 3, y: 3 };
        this.dim = { w: this.data.frameWidth, h: this.data.frameHeight / 2 };
        this.angle = angle;
        this.gameFrame = 0;
    }

    draw(ctx) {
        const position = Math.floor(this.gameFrame / 10) % this.data.animations['projectile'].loc.length;
        const frameX = this.data.animations['projectile'].loc[position].x;
        const frameY = this.data.animations['projectile'].loc[position].y;

        ctx.setTransform(1, 0, 0, 1, this.pos.x + this.dim.w / 2, this.pos.y + this.dim.h / 2);
        ctx.rotate(this.angle - Math.PI / 2);
        ctx.drawImage(this.sprite, frameX, frameY, this.data.frameWidth, this.data.frameHeight, -this.dim.w / 2, -this.dim.h / 2, this.data.frameWidth, this.data.frameHeight);
        ctx.resetTransform();

        this.gameFrame++;

        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.closePath();
        }
    }

    update() {
        this.pos.x -= this.vel.x * Math.cos(this.angle);
        this.pos.y -= this.vel.y * Math.sin(this.angle);
    }
}