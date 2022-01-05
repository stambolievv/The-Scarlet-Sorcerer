import { audio } from '../properties.js';
import createTimer from '../util/Timer.js';

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
    this.animation = {
      state: 'idle',
      orientation: 'Right'
    };
    this.state = {
      grounded: false,
      jumping: false,
      outOfOxygen: false,
      onIsland: false,
      canShoot: true
    };
    this.stats = {
      level: 1,
      perks: 0,
      health: 3,
      maxHealth: 3,
      bonusHealth: 2,
      maxBonusHealth: 5,
      mana: 100,
      maxMana: 100,
      manaReg: 0.04,
      oxygen: 300,
      maxOxygen: 300,
      jumpBoost: 15,
      movementSpeed: 4,
      fireRate: 1.6,
      fireRateReg: 0
    };
  }

  draw(ctx, elapsed) {
    const offset = this.animation.orientation == 'Right' ? 1 : 2;

    const position = Math.floor(elapsed * 0.01) % this.prop.animations[(this.animation.state + this.animation.orientation)].loc.length;
    const frameX = this.prop.animations[(this.animation.state + this.animation.orientation)].loc[position].x;
    const frameY = this.prop.animations[(this.animation.state + this.animation.orientation)].loc[position].y;

    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x - this.dim.w * offset, this.pos.y - this.dim.h * 0.9, this.prop.frameWidth * 0.7, this.prop.frameHeight * 0.7);

    if (ctx.DEBUG) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
      ctx.closePath();
    }
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
        if (!this.state.jumping && this.state.grounded) {
          this.state.jumping = true;
          this.state.grounded = false;
          this.vel.y -= this.stats.jumpBoost;
        }
        this.animation.state = this.state.grounded ? 'idle' : 'jump';
      },
      KeyA: () => {
        if (!side.left && this.vel.x > -this.stats.movementSpeed) {
          this.vel.x--;
        }
        if (side.bottom) { audio.footsteps.play(); }
        this.animation.orientation = 'Left';
        this.animation.state = 'run';
      },
      KeyS: () => {
        if (!side.bottom && this.vel.y < this.stats.jumpBoost) {
          this.vel.y++;
        }
        this.animation.state = this.state.grounded ? 'idle' : 'fall';
      },
      KeyD: () => {
        if (!side.right && this.vel.x < this.stats.movementSpeed) {
          this.vel.x++;
        }
        if (side.bottom) { audio.footsteps.play(); }
        this.animation.orientation = 'Right';
        this.animation.state = 'run';
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
      this.animation.state = 'idle';
    }

    this.state.grounded = false;
    if (side.bottom && !(side.left || side.right)) {
      this.state.grounded = true;
      this.state.jumping = false;
    }
    if (side.left || side.right) { this.vel.x = 0; }
    if (side.top) { this.vel.y *= -0.1; }

    if (this.painfulFrame.includes(side.type) && side.bottom) { this.state.onIsland = true; } else { this.state.onIsland = false; }
    if (!(side.left || side.top || side.right || side.bottom || this.state.jumping)) { this.animation.state = 'fall'; }

    this.vel.x += this.gravity.x;
    this.vel.y += this.gravity.y;
    this.vel.x *= this.friction.x;
    this.vel.y *= this.friction.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (Math.abs(this.vel.x) < 0.1) { this.vel.x = 0; }
    if (this.state.grounded) { this.vel.y = 0; }
  }

  handleStats() {
    // handle fireRate 
    this.stats.fireRateReg += 0.01;
    const timePassed = Number(this.stats.fireRateReg.toFixed(1));
    const fireRate = Number(this.stats.fireRate.toFixed(1));
    if ((timePassed == fireRate) && !this.state.canShoot) {
      this.stats.fireRateReg = 0;
      this.state.canShoot = true;
    }

    // handle oxygen
    if (this.stats.oxygen < 300 && !this.state.onIsland) {
      this.stats.oxygen += 0.5;
      this.state.outOfOxygen = false;
    } else if (this.stats.oxygen > 0 && this.state.onIsland) {
      this.stats.oxygen -= 0.5;
      this.state.outOfOxygen = false;
    } else if (this.stats.oxygen == 0 && this.state.onIsland) {
      oxygenTimer.start();
      this.state.outOfOxygen = false;
      if (oxygenTimer.output > 3) {
        if (this.stats.bonusHealth > 0) {
          this.stats.bonusHealth -= 1;
        } else {
          this.stats.health -= 1;
        }
        this.state.outOfOxygen = true;
        oxygenTimer.reset();
      }
    } else {
      this.state.outOfOxygen = false;
      oxygenTimer.reset();
    }

    // handle mana
    if (this.stats.mana <= 100) {
      this.stats.mana += this.stats.manaReg;
    }
  }
}