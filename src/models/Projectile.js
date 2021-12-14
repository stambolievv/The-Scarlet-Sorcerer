export default class Projectiles {
    constructor(data, sprite, parent, orientation, angle, mouseX, mouseY) {
        this.data = data;
        this.sprite = sprite;
        this.pos = { x: parent.pos.x + parent.dim.w * 0.25, y: parent.pos.y + parent.dim.h * 0.25 };
        this.vel = { x: 3, y: 3 };
        this.dim = { w: this.data.frameWidth, h: this.data.frameHeight / 2 };
        this.orientation = orientation;
        this.angle = angle;
        this.gameFrame = 0;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    draw(ctx) {
        const offset = this.orientation == 'Right' ? 0 : -this.data.frameHeight;

        const position = Math.floor(this.gameFrame / 10) % this.data.animations['projectile'].loc.length;
        const frameX = this.data.animations['projectile'].loc[position].x;
        const frameY = this.data.animations['projectile'].loc[position].y;

        // ctx.setTransform(1, 0, 0, 1, this.pos.x, this.pos.y);
        // ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, frameX, frameY, this.data.frameWidth, this.data.frameHeight, this.pos.x, this.pos.y, this.data.frameWidth, this.data.frameHeight);
        // ctx.resetTransform();

        this.gameFrame++;

        // if (ctx.DEBUG) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        // }
    }

    update() {
        this.pos.x -= this.vel.x * Math.cos(this.angle);
        this.pos.y -= this.vel.y * Math.sin(this.angle);
    }
}