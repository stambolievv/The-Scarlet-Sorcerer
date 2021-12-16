class Enemy {
    constructor(data, sprite, player, stats, position) {
        this.data = data;
        this.sprite = sprite;
        this.player = player;
        this.pos = { x: position.x, y: position.y };
        this.vel = { x: 0, y: 0 };
        this.dim = { w: this.data.frameWidth * 0.7, h: this.data.frameHeight * 0.7 };
        this.gravity = { x: 0, y: 0.1 };
        this.orientation = Math.random() < 0.45 ? 'Left' : 'Right';
        this.type = this.constructor.name.toLocaleLowerCase();
        this.stats = {
            health: 1,
            speed: stats.speed,
        };
    }

    draw(ctx, elapsed) {
        const position = Math.floor(elapsed * 0.01) % this.data.animations[(this.type + this.orientation)].loc.length;
        const frameX = this.data.animations[(this.type + this.orientation)].loc[position].x;
        const frameY = this.data.animations[(this.type + this.orientation)].loc[position].y;

        ctx.drawImage(this.sprite, frameX, frameY, this.data.frameWidth, this.data.frameHeight, this.pos.x - this.dim.w * 0.3, this.pos.y - this.dim.h * 0.3, this.data.frameWidth, this.data.frameHeight);

        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.closePath();
        }
    }
}


export class Bat extends Enemy {
    constructor(data, sprite, player, stats, position) {
        super(data, sprite, player, stats, position);
        this.prop = this.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
        this.pos.x = this.prop.spawn;
        this.pos.y *= (Math.random() * (0.7 - 0.1) + 0.1);
    }

    update() {
        this.pos.x += this.prop.movement * (Math.random() * this.stats.speed);
        this.pos.y += Math.sin(Math.random() * 4 - 5);
    }
}

export class Skeleton extends Enemy {
    constructor(data, sprite, player, stats, position) {
        super(data, sprite, player, stats, position);
        this.pos.x *= Math.random() * (0.9 - 0.1) + 0.1;
        this.pos.y *= Math.random() * (0.3 - 0.15) + 0.15;
    }

    update(side) {

        if (side.left || this.pos.x < this.player.pos.x) {
            this.vel.x = this.vel.x > this.stats.speed ? this.stats.speed : this.vel.x += 0.1;
            this.orientation = 'Right';
        } else if (side.right || this.pos.x > this.player.pos.x) {
            this.vel.x = this.vel.x < -this.stats.speed ? -this.stats.speed : this.vel.x -= 0.1;
            this.orientation = 'Left';
        } else {
            // fixing the bug when player is close to border of the screen and enemy stop moving
            if (this.vel.x >= 0.1) {
                this.orientation = 'Right';
                this.vel.x = this.vel.x > this.stats.speed ? this.stats.speed : this.vel.x += 0.1;
            } else {
                this.orientation = 'Left';
                this.vel.x = this.vel.x < -this.stats.speed ? -this.stats.speed : this.vel.x -= 0.1;
            }
        }

        this.vel.x += this.gravity.x;
        this.vel.y += this.gravity.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        if (side.left) { this.vel.x += 2.5; }
        if (side.right) { this.vel.x -= 2.5; }
        if (side.bottom) { this.vel.y = 0; }
    }
}

export class Saw extends Enemy {
    constructor(data, sprite, player, stats, position) {
        super(data, sprite, player, stats, position);
        this.prop = this.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
        this.pos.x = this.prop.spawn;
        this.pos.y *= Math.random() * (0.7 - 0.1) + 0.1;
    }

    update() {
        this.pos.x += this.prop.movement * 10;
        this.vel.y += this.gravity.y / 2;
        this.pos.y += this.vel.y;
    }
}