import createTimer from './Timer.js';

const manaTimer = new createTimer(true);
const fireRateTimer = new createTimer(true);
const oxygenTimer = new createTimer(true);

export default class Player {
    constructor(data, sprite, painfulFrame, position) {
        this.data = data;
        this.sprite = sprite;
        this.painfulFrame = painfulFrame;
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
        this.gameFrame = 0;
    }

    draw(ctx) {
        const offset = this.orientation == 'Right' ? 1 : 2;

        const position = Math.floor(this.gameFrame / 5) % this.data.animations[(this.state + this.orientation)].loc.length;
        const frameX = this.data.animations[(this.state + this.orientation)].loc[position].x;
        const frameY = this.data.animations[(this.state + this.orientation)].loc[position].y;
        ctx.drawImage(this.sprite, frameX, frameY, this.data.frameWidth, this.data.frameHeight, this.pos.x - this.dim.w * offset, this.pos.y - this.dim.h * 0.9, this.data.frameWidth * 0.7, this.data.frameHeight * 0.7);
        this.gameFrame++;


        if (ctx.DEBUG) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
            ctx.closePath();
        }

        ctx.font = '24px customFont';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'white';
        ctx.fillText('Player', ctx.canvas.width * 0.03, ctx.canvas.height * 0.05);
        ctx.font = '18px customFont';
        ctx.fillStyle = 'LightGreen';
        ctx.fillText('Level: ' + this.stats.level, ctx.canvas.width * 0.04, ctx.canvas.height * 0.160);
        ctx.fillText('HP: ' + this.stats.health, ctx.canvas.width * 0.04, ctx.canvas.height * 0.185);
        ctx.fillText('Bonus HP: ' + this.stats.bonusHealth, ctx.canvas.width * 0.04, ctx.canvas.height * 0.210);
        ctx.fillText('Oxygen: ' + this.stats.oxygen, ctx.canvas.width * 0.04, ctx.canvas.height * 0.235);
        ctx.fillText('Mana: ' + this.stats.mana, ctx.canvas.width * 0.04, ctx.canvas.height * 0.260);
        ctx.fillText('Fire Rate: ' + this.stats.fireRate.toFixed(1), ctx.canvas.width * 0.04, ctx.canvas.height * 0.285);
        ctx.fillText('Movement Speed: ' + this.stats.movementSpeed.toFixed(1), ctx.canvas.width * 0.04, ctx.canvas.height * 0.310);
        ctx.fillText('Jump Boost: ' + this.stats.jumpBoost.toFixed(1), ctx.canvas.width * 0.04, ctx.canvas.height * 0.335);
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
        if (side.bottom && !(side.left || side.right)) { this.grounded = true; this.jumping = false; }
        if (side.left || side.right) { this.vel.x = 0; }
        if (side.top) { this.vel.y *= -0.1; }

        if (this.painfulFrame.includes(side.type) && side.bottom) { this.stats._onIsland = true; } else { this.stats._onIsland = false; }
        if (!side.left && !side.top && !side.right && !side.bottom && !this.jumping) { this.state = 'fall'; }

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


//     Movement states
//     holdsRight: function() {
//         return this.keyboard.right.isDown || this.keyboard.D.isDown
//     },
//     holdsLeft: function() {
//         return this.keyboard.left.isDown || this.keyboard.A.isDown 
//     },
//     holdsUp: function() {
//         return this.keyboard.space.isDown || this.keyboard.up.isDown || this.keyboard.W.isDown 
//     },

//     Player stands
//     playerStands: function() { return this.player.body.onFloor() || this.player.body.touching.down },

//      Collision with ground
//     landPlayer: function() {
//         if (this.playerState.jumping && this.playerStands()) {
//             // Update state to running
//             this.playerState.jumping = false
//             // Update player animation
//             playerSpriteStand()
//         }
//     },