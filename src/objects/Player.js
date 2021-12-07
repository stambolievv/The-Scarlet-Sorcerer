import { ctx } from '../app.js';
import createTimer from '../common/Timer.js';

const manaTimer = new createTimer();
manaTimer.raw = true;

export default class Player {
    constructor(posX, posY) {
        this.pos = { x: posX, y: posY };
        this.vel = { x: 0, y: 0 };
        this.gravity = { x: 0, y: 0.6 };
        this.dim = { w: 54.92, h: 80 };
        this.friction = { x: 0.9, y: 0.99 };
        this.grounded = false;
        this.jumping = false;
        this.stats = {
            level: 1,
            health: 3,
            bonusHealth: 2,
            mana: 10,
            manaReg: 3,
            oxygen: 3,
            fireRate: 2,
            movementSpeed: 5,
            jumpBoost: 20
        };
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'hsl(100, 100%, 50%, 0.3)';
        ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();

        ctx.font = '24px customFont';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.fillText('Player', ctx.canvas.width * 0.03, ctx.canvas.height * 0.05);
        ctx.font = '18px customFont';
        ctx.fillStyle = 'LightGreen';
        ctx.fillText('Level: ' + this.stats.level, ctx.canvas.width * 0.03, ctx.canvas.height * 0.10);
        ctx.fillText('HP: ' + this.stats.health, ctx.canvas.width * 0.03, ctx.canvas.height * 0.12);
        ctx.fillText('Bonus HP: ' + this.stats.bonusHealth, ctx.canvas.width * 0.03, ctx.canvas.height * 0.14);
        ctx.fillText('Oxygen: ' + this.stats.oxygen, ctx.canvas.width * 0.03, ctx.canvas.height * 0.16);
        ctx.fillText('Mana: ' + this.stats.mana, ctx.canvas.width * 0.03, ctx.canvas.height * 0.18);
        ctx.fillText('Fire Rate: ' + this.stats.fireRate, ctx.canvas.width * 0.03, ctx.canvas.height * 0.20);
        ctx.fillText('Movement Speed: ' + this.stats.movementSpeed, ctx.canvas.width * 0.03, ctx.canvas.height * 0.22);
        ctx.fillText('Jump Boost: ' + this.stats.jumpBoost, ctx.canvas.width * 0.03, ctx.canvas.height * 0.24);
    }

    update(keysPressed, sideWorld, sideCollision) {
        const side = {
            top: sideWorld.top || sideCollision.top,
            bottom: sideWorld.bottom || sideCollision.bottom,
            left: sideWorld.left || sideCollision.left,
            right: sideWorld.right || sideCollision.right
        };
        const keys = [...keysPressed];
        const controller = {
            KeyW: () => {
                if (!this.jumping && this.grounded) {
                    this.jumping = true;
                    this.grounded = false;
                    this.vel.y -= this.stats.jumpBoost;
                }
            },
            KeyA: () => {
                if (!side.left && this.vel.x > -this.stats.movementSpeed) {
                    this.vel.x--;
                }
            },
            KeyS: () => {
                if (!side.bottom && this.vel.y < this.stats.jumpBoost) {
                    this.vel.y++;
                }
            },
            KeyD: () => {
                if (!side.right && this.vel.x < this.stats.movementSpeed) {
                    this.vel.x++;
                }
            },
            Space: () => { controller.KeyW(); },
            ArrowUp: () => { controller.KeyW(); },
            ArrowDown: () => { controller.KeyS(); },
            ArrowLeft: () => { controller.KeyA(); },
            ArrowRight: () => { controller.KeyD(); },
        };
        if (keys.length > 0) {
            try {
                keys.forEach(key => { controller[key](); });
            } catch {
                console.error('Not a functional key is pressed!');
            }
        }

        this.grounded = false;
        if (side.bottom) { this.grounded = true; this.jumping = false; }
        if (side.left || side.right) { this.vel.x = 0; }
        if (side.top) { this.vel.y *= -0.1; }

        this.vel.x += this.gravity.x;
        this.vel.y += this.gravity.y;
        this.vel.x *= this.friction.x;
        this.vel.y *= this.friction.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (Math.abs(this.vel.x) < 0.1) { this.vel.x = 0; }
        if (this.grounded) { this.vel.y = 0; }
    }

    handleStats() {
        if (this.stats.mana < 10) {
            manaTimer.start();
            if (manaTimer.output > this.stats.manaReg) {
                this.stats.mana++;
                manaTimer.reset();
            }
        }
    }
}