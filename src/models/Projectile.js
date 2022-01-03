export default class Projectiles {
    constructor(data) {
        this.prop = data.prop;
        this.sprite = data.sprite;
        this.player = data.player;
        this.pos = { x: this.player.pos.x + this.player.dim.w / 4, y: this.player.pos.y - this.player.dim.h / 4 };
        this.vel = { x: 3, y: 3 };
        this.dim = { w: this.prop.frameWidth, h: this.prop.frameHeight / 2 };
        this.angle = data.angle;
    }

    draw(ctx, elapsed) {
        const position = Math.floor(elapsed * 0.01) % this.prop.animations['projectile'].loc.length;
        const frameX = this.prop.animations['projectile'].loc[position].x;
        const frameY = this.prop.animations['projectile'].loc[position].y;

        ctx.setTransform(1, 0, 0, 1, this.pos.x + this.dim.w / 2, this.pos.y + this.dim.h / 2);
        ctx.rotate(this.angle - Math.PI / 2);
        ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, -this.dim.w / 2, -this.dim.h / 2, this.prop.frameWidth, this.prop.frameHeight);
        ctx.resetTransform();

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