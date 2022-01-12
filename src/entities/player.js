import { GAME, ASSETS, DATA } from '../properties.js';
import { players, enemies, platforms } from '../constants.js';
import { overlap, collision, collideWorldBounds, relativePosition } from '../mechanics.js';
import { messageCreate } from '../util/floatingMessage.js';

class Player {
  constructor(data, position) {
    this.prop = data.prop;
    this.sprite = data.sprite;
    this.painfulFrame = data.painfulFrame;
    this.elapsed = 0;
    this.pos = { x: position.x, y: position.y };
    this.vel = { x: 0, y: 0 };
    this.dim = { w: 30, h: 50 };
    this.gravity = { x: 0, y: 0.5 };
    this.friction = { x: 0.9, y: 0.99 };
    this.animation = {
      type: 'idle',
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
      health: 5,
      maxHealth: 5,
      bonusHealth: 3,
      maxBonusHealth: 5,
      mana: 100,
      maxMana: 100,
      manaReg: 0.04,
      oxygen: 300,
      maxOxygen: 300,
      oxygenReg: 0,
      jumpBoost: 15.4,
      movementSpeed: 4,
      fireRate: 1.6,
      minFireRate: 0,
      fireRateReg: 0
    };
  }

  draw(ctx, deltaTime) {
    this.elapsed += deltaTime * 0.01;

    const position = Math.floor(this.elapsed) % this.prop.animations[(this.animation.type + this.animation.orientation)].loc.length;
    const frameX = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].x;
    const frameY = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].y;

    const offset = this.animation.orientation == 'Right' ? 1 : 2;
    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x - this.dim.w * offset, this.pos.y - this.dim.h * 0.9, this.prop.frameWidth * 0.7, this.prop.frameHeight * 0.7);

    if (GAME.DEBUG) {
      ctx.strokeStyle = 'white';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
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

    this.controller(keysPressed, side);

    this.state.grounded = false;
    if (side.bottom && !(side.left || side.right)) {
      this.state.grounded = true;
      this.state.jumping = false;
    }
    if (side.left || side.right) { this.vel.x = 0; }
    if (side.top) { this.vel.y *= -0.1; }

    if (this.painfulFrame.includes(side.type) && side.bottom) { this.state.onIsland = true; } else { this.state.onIsland = false; }
    if (!(side.left || side.top || side.right || side.bottom || this.state.jumping)) { this.animation.type = 'fall'; }

    this.vel.x += this.gravity.x;
    this.vel.y += this.gravity.y;
    this.vel.x *= this.friction.x;
    this.vel.y *= this.friction.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (Math.abs(this.vel.x) < 0.1) { this.vel.x = 0; }
    if (this.state.grounded) { this.vel.y = 0; }
  }

  controller(keysPressed, side) {
    const controls = {
      KeyW: () => {
        if (!this.state.jumping && this.state.grounded) {
          this.state.jumping = true;
          this.state.grounded = false;
          this.vel.y -= this.stats.jumpBoost;
        }
        this.animation.type = this.state.grounded ? 'idle' : 'jump';
      },
      KeyA: () => {
        if (!side.left && this.vel.x > -this.stats.movementSpeed) { this.vel.x--; }
        if (side.bottom) { ASSETS.audio.footsteps.play(); }
        this.animation.orientation = 'Left';
        this.animation.type = 'run';
      },
      KeyS: () => {
        if (!side.bottom && this.vel.y < this.stats.jumpBoost) { this.vel.y++; }
        this.animation.type = this.state.grounded ? 'idle' : 'fall';
      },
      KeyD: () => {
        if (!side.right && this.vel.x < this.stats.movementSpeed) { this.vel.x++; }
        if (side.bottom) { ASSETS.audio.footsteps.play(); }
        this.animation.orientation = 'Right';
        this.animation.type = 'run';
      },
      Space: () => { controls.KeyW(); },
      ArrowUp: () => { controls.KeyW(); },
      ArrowDown: () => { controls.KeyS(); },
      ArrowLeft: () => { controls.KeyA(); },
      ArrowRight: () => { controls.KeyD(); },
    };

    const keys = [...keysPressed];
    if (keys.length > 0) {
      try {
        keys.forEach(key => { controls[key](); });
      } catch (err) {
        // console.error('Not a functional key is pressed!');
      }
    } else {
      this.animation.type = 'idle';
    }
  }

  handleStats(deltaTime) {
    // handle fireRate 
    this.stats.fireRateReg += deltaTime * 0.001;
    if ((this.stats.fireRateReg >= this.stats.fireRate) && !this.state.canShoot) {
      this.state.canShoot = true;
      this.stats.fireRateReg = 0;
    }

    // handle oxygen
    if (this.stats.oxygen < 300 && !this.state.onIsland) {
      this.state.outOfOxygen = false;
      this.stats.oxygen += deltaTime * 0.05;
    } else if (this.stats.oxygen > 0 && this.state.onIsland) {
      this.state.outOfOxygen = false;
      this.stats.oxygen -= deltaTime * 0.05;
    } else if (this.stats.oxygen <= 0 && this.state.onIsland) {
      this.stats.oxygenReg += deltaTime * 0.1;
      this.state.outOfOxygen = false;
      if (this.stats.oxygenReg > 300) {
        if (this.stats.bonusHealth > 0) {
          this.stats.bonusHealth -= 1;
        } else {
          this.stats.health -= 1;
        }
        ASSETS.audio.oxygen.play();
        this.stats.oxygenReg = 0;
        this.state.outOfOxygen = true;
      }
    } else {
      this.stats.oxygenReg = 0;
      this.state.outOfOxygen = false;
    }

    // handle mana
    if (this.stats.mana <= 100) {
      this.stats.mana += this.stats.manaReg;
    }
  }
}

(function create() {
  const data = {
    prop: DATA.player,
    sprite: ASSETS.images.player,
    painfulFrame: DATA.tileset.painfulFrame
  };

  players.push(new Player(data, relativePosition(0.1, 0.65)));
})();

function playerAnimation(ctx, deltaTime) {
  const sideWorld = collideWorldBounds(players);
  const sideCollision = collision(players, platforms);

  players.forEach(p => {
    p.draw(ctx, deltaTime);
    p.update(GAME.KEYBOARD, sideWorld, sideCollision);
    p.handleStats(deltaTime);
    if (p.state.outOfOxygen) {
      messageCreate('Out of oxygen. You are taking damage', 90, 40, 'red');
    }
  });

  overlap(players, enemies, (player, enemy) => {
    enemies.splice(enemies.indexOf(enemy), 1);
    ASSETS.audio.enemyKill.play();

    if (player.stats.bonusHealth > 0) {
      player.stats.bonusHealth -= 1;
    } else {
      player.stats.health -= 1;
    }
  });

  if (players[0].stats.health <= 0 && !GAME.immortal) {
    GAME.GAMEOVER = true;
    ASSETS.audio.background.pause();
    ASSETS.audio.gameover.play();
  }
}

export {
  playerAnimation
};
