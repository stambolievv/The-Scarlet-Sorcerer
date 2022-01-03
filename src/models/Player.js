import { audio } from '../properties.js';
import createTimer from './Timer.js';

const manaTimer = new createTimer(true);
const fireRateTimer = new createTimer(true);
const oxygenTimer = new createTimer(true);

export default class Player {
    constructor(data, position) {
        this.prop = data.prop;
        this.sprite = data.sprite;
        this.painfulFrame = data.painfulFrame;
        this.pos = { x: position.x, y: position.y };
        this.vel = { x: 0, y: 0 };
        this.dim = { w: 30, h: 50 };
        this.gravity = { x: 0, y: 0.5 };
        this.friction = { x: 0.9, y: 0.99 };
        this.state = 'idle';
        this.orientation = 'Right';
        this.grounded = false;
        this.jumping = false;
        this.stats = {
            level: 1,
            health: 3,
            bonusHealth: 2,
            mana: 5,
            _manaReg: 5,
            oxygen: 3,
            _outOfOxygen: false,
            _onIsland: false,
            fireRate: 2,
            _canShoot: true,
            movementSpeed: 4,
            jumpBoost: 15
        };
    }

    draw(ctx, elapsed) {
        const offset = this.orientation == 'Right' ? 1 : 2;

        const position = Math.floor(elapsed * 0.01) % this.prop.animations[(this.state + this.orientation)].loc.length;
        const frameX = this.prop.animations[(this.state + this.orientation)].loc[position].x;
        const frameY = this.prop.animations[(this.state + this.orientation)].loc[position].y;

        ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x - this.dim.w * offset, this.pos.y - this.dim.h * 0.9, this.prop.frameWidth * 0.7, this.prop.frameHeight * 0.7);

        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.closePath();
        }
        ctx.textAlign = 'right';
        ctx.font = '18px rubber';
        ctx.fillStyle = 'LightGreen';
        ctx.fillText('Level: ' + this.stats.level, ctx.canvas.width * 0.9, ctx.canvas.height * 0.160);
        ctx.fillText('Fire Rate: ' + this.stats.fireRate.toFixed(1), ctx.canvas.width * 0.9, ctx.canvas.height * 0.285);
        ctx.fillText('Movement Speed: ' + this.stats.movementSpeed.toFixed(1), ctx.canvas.width * 0.9, ctx.canvas.height * 0.310);
        ctx.fillText('Jump Boost: ' + this.stats.jumpBoost.toFixed(1), ctx.canvas.width * 0.9, ctx.canvas.height * 0.335);
    }

    update(keysPressed, sideWorld, sideCollision) {
        const side = {
            top: sideWorld.top || sideCollision.top,
            bottom: sideWorld.bottom || sideCollision.bottom,
            left: sideWorld.left || sideCollision.left,
            right: sideWorld.right || sideCollision.right,
            type: sideCollision.type
        };
        const keys = [...keysPressed];
        const controller = {
            KeyW: () => {
                if (!this.jumping && this.grounded) {
                    this.jumping = true;
                    this.grounded = false;
                    this.vel.y -= this.stats.jumpBoost;
                }
                this.state = this.grounded ? 'idle' : 'jump';
            },
            KeyA: () => {
                if (!side.left && this.vel.x > -this.stats.movementSpeed) {
                    this.vel.x--;
                }
                if (side.bottom) { audio.footsteps.play(); }
                this.orientation = 'Left';
                this.state = 'run';
            },
            KeyS: () => {
                if (!side.bottom && this.vel.y < this.stats.jumpBoost) {
                    this.vel.y++;
                }
                this.state = this.grounded ? 'idle' : 'fall';
            },
            KeyD: () => {
                if (!side.right && this.vel.x < this.stats.movementSpeed) {
                    this.vel.x++;
                }
                if (side.bottom) { audio.footsteps.play(); }
                this.orientation = 'Right';
                this.state = 'run';
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
            } catch (err) {
                // console.error('Not a functional key is pressed!');
            }
        } else {
            this.state = 'idle';
        }

        this.grounded = false;
        if (side.bottom && !(side.left || side.right)) {
            this.grounded = true;
            this.jumping = false;
        }
        if (side.left || side.right) { this.vel.x = 0; }
        if (side.top) { this.vel.y *= -0.1; }

        if (this.painfulFrame.includes(side.type) && side.bottom) { this.stats._onIsland = true; } else { this.stats._onIsland = false; }
        if (!(side.left || side.top || side.right || side.bottom || this.jumping)) { this.state = 'fall'; }

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
        // handle fireRate 
        if (!this.stats._canShoot) {
            fireRateTimer.start();
            if (fireRateTimer.output / 2 >= this.stats.fireRate) {
                this.stats._canShoot = true;
                fireRateTimer.reset();
            }
        } else {
            fireRateTimer.reset();
        }

        // handle oxygen
        if (this.stats.oxygen < 3 && !this.stats._onIsland) {
            oxygenTimer.start();
            if (oxygenTimer.output > 3) {
                this.stats.oxygen += 1;
                oxygenTimer.reset();
            }
            this.stats._outOfOxygen = false;
        } else if (this.stats.oxygen > 0 && this.stats._onIsland) {
            oxygenTimer.start();
            if (oxygenTimer.output > 3) {
                this.stats.oxygen -= 1;
                oxygenTimer.reset();
            }
            this.stats._outOfOxygen = false;
        } else if (this.stats.oxygen == 0 && this.stats._onIsland) {
            oxygenTimer.start();
            this.stats._outOfOxygen = false;
            if (oxygenTimer.output > 3) {
                if (this.stats.bonusHealth > 0) {
                    this.stats.bonusHealth -= 1;
                } else {
                    this.stats.health -= 1;
                }
                oxygenTimer.reset();
                this.stats._outOfOxygen = true;
            }
        } else {
            oxygenTimer.reset();
            this.stats._outOfOxygen = false;
        }

        // handle mana
        if (this.stats.mana < 5) {
            manaTimer.start();
            if (manaTimer.output > this.stats._manaReg) {
                this.stats.mana++;
                manaTimer.reset();
            }
        } else {
            manaTimer.reset();
        }
    }
}