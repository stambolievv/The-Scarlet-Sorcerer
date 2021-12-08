import createTimer from '../../common/Timer.js';

const manaTimer = new createTimer(true);
const fireRateTimer = new createTimer(true);
const oxygenTimer = new createTimer(true);

export default class Player {
    constructor(position) {
        this.pos = { x: position.x, y: position.y };
        this.vel = { x: 0, y: 0 };
        this.dim = { w: 54.92, h: 80 };
        this.gravity = { x: 0, y: 0.6 };
        this.friction = { x: 0.9, y: 0.99 };
        this.grounded = false;
        this.jumping = false;
        this.stats = {
            level: 1,
            health: 3,
            bonusHealth: 2,
            mana: 1,
            _manaReg: 3,
            oxygen: 3,
            _outOfOxygen: false,
            _onIsland: false,
            fireRate: 0.2,
            _canShoot: true,
            movementSpeed: 5,
            jumpBoost: 20
        };
    }

    draw(ctx) {
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
            } catch (err) {
                // console.error('Not a functional key is pressed!');
            }
        }

        this.grounded = false;
        if (side.bottom) { this.grounded = true; this.jumping = false; }
        if (side.left || side.right) { this.vel.x = 0; }
        if (side.top) { this.vel.y *= -0.1; }
        if (side.type == 'island' && side.bottom) { this.stats._onIsland = true; } else { this.stats._onIsland = false; }

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
        if (this.stats.mana < 10) {
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