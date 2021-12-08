export default class Enemy {
    constructor(player, position, inputStats) {
        this.player = player;
        this.pos = { x: position.x, y: position.y };
        this.vel = { x: 0, y: 0 };
        this.dim = { w: 80, h: 50 };
        this.gravity = { x: 0, y: 0.1 };
        this.stats = {
            health: inputStats.health,
            bonusHealth: inputStats.bonusHealth,
            movementSpeed: inputStats.movementSpeed,
        };
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%, 0.3)`;
        ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();

        ctx.font = '24px customFont';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.fillText('Enemy', ctx.canvas.width * 0.93, ctx.canvas.height * 0.05);
        ctx.font = '18px customFont';
        ctx.fillStyle = 'LightGreen';
        ctx.fillText('HP: ' + this.stats.health, ctx.canvas.width * 0.93, ctx.canvas.height * 0.10);
        ctx.fillText('BonusHP: ' + this.stats.bonusHealth, ctx.canvas.width * 0.93, ctx.canvas.height * 0.12);
        ctx.fillText('Movement Speed: ' + Math.round((this.stats.movementSpeed) * 100) / 100, ctx.canvas.width * 0.93, ctx.canvas.height * 0.14);
    }

    update(offset, sideWorld, sideCollision) {
        const side = {
            top: sideWorld.top || sideCollision.top,
            bottom: sideWorld.bottom || sideCollision.bottom,
            left: sideWorld.left || sideCollision.left,
            right: sideWorld.right || sideCollision.right
        };



        if (side.left || this.pos.x < this.player.pos.x - offset) {
            this.vel.x = this.vel.x > this.stats.movementSpeed ? this.stats.movementSpeed : this.vel.x += 0.1;
        } else if (side.right || this.pos.x > this.player.pos.x + offset) {
            this.vel.x = this.vel.x < -this.stats.movementSpeed ? -this.stats.movementSpeed : this.vel.x -= 0.1;
        } else {
            // fixing the bug when player is close to border of the screen, enemy stop moving
            if (this.vel.x >= 0.1) {
                this.vel.x = this.vel.x > this.stats.movementSpeed ? this.stats.movementSpeed : this.vel.x += 0.1;
            } else {
                this.vel.x = this.vel.x < -this.stats.movementSpeed ? -this.stats.movementSpeed : this.vel.x -= 0.1;
            }
        }

        // this.vel.x += this.gravity.x;
        // this.vel.y += this.gravity.y;
        // this.pos.x += this.vel.x;
        // this.pos.y += this.vel.y;
        // if (side.bottom) { this.vel.y = 0; }
    }
}