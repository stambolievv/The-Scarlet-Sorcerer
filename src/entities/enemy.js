import { GAME, ASSETS, DATA } from '../properties.js';
import { enemies, enemyStats, players, platforms, projectiles } from '../constants.js';
import { overlap, collision, removeWorldOutBounds, relativePosition, random } from '../mechanics.js';
import { spawnPerk } from './perk.js';
import { messageCreate } from '../util/floatingMessage.js';

class Enemy {
  constructor(data, position) {
    this.prop = data.prop;
    this.sprite = data.sprite;
    this.player = data.player;
    this.elapsed = 0;
    this.pos = { x: position.x, y: position.y };
    this.vel = { x: 0, y: 0 };
    this.dim = { w: this.prop.frameWidth * 0.7, h: this.prop.frameHeight * 0.7 };
    this.gravity = { x: 0, y: 0.1 };
    this.animation = {
      type: this.constructor.name.toLocaleLowerCase(),
      orientation: Math.random() < 0.45 ? 'Left' : 'Right'
    };
    this.stats = {
      health: 1,
      speed: data.stats.speed,
    };
  }

  static spawnInterval = 0;

  draw(ctx, deltaTime) {
    this.elapsed += deltaTime * 0.01;

    const position = Math.floor(this.elapsed) % this.prop.animations[(this.animation.type + this.animation.orientation)].loc.length;
    const frameX = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].x;
    const frameY = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].y;

    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x - this.dim.w * 0.3, this.pos.y - this.dim.h * 0.3, this.prop.frameWidth, this.prop.frameHeight);

    if (ctx.DEBUG) {
      ctx.strokeStyle = 'white';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }
}

class Bat extends Enemy {
  constructor(data, position) {
    super(data, position);
    this.props = this.animation.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
    this.pos.x = this.props.spawn;
    this.pos.y *= random(1, 7) / 10;
  }

  update() {
    this.pos.x += this.props.movement * (Math.random() * this.stats.speed);
    this.pos.y += Math.sin(random(0, Math.PI * 2)) * 2;
  }
}
class Skeleton extends Enemy {
  constructor(data, position) {
    super(data, position);
    this.pos.x *= random(9, 1) / 10;
    this.pos.y *= random(2, 3) / 10;
    this.stats.speed += random(0, 8) * 10 / 100;
  }

  update(side) {
    // Some space for enemy to walk.
    const sideMovement = 100;
    if (side.left || this.pos.x < this.player.pos.x - sideMovement) {
      this.vel.x = this.vel.x > this.stats.speed ? this.stats.speed : this.vel.x += 0.1;
      this.animation.orientation = 'Right';
    } else if (side.right || this.pos.x > this.player.pos.x + sideMovement) {
      this.vel.x = this.vel.x < -this.stats.speed ? -this.stats.speed : this.vel.x -= 0.1;
      this.animation.orientation = 'Left';
    } else {
      // Fixing the bug when player is close to the border of the screen and enemy stop moving.
      if (this.vel.x >= 0.1) {
        this.animation.orientation = 'Right';
        this.vel.x = this.vel.x > this.stats.speed ? this.stats.speed : this.vel.x += 0.1;
      } else {
        this.animation.orientation = 'Left';
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
class Saw extends Enemy {
  constructor(data, position) {
    super(data, position);
    this.props = this.animation.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
    this.pos.x = this.props.spawn;
    this.pos.y *= random(1, 7) / 10;
  }

  update() {
    this.pos.x += this.props.movement * 10;
    this.vel.y += this.gravity.y / 2;
    this.pos.y += this.vel.y;
  }
}

function create(enemyInstance) {
  const spawnPoint = relativePosition(1, 1);
  const type = enemyInstance.name.toLocaleLowerCase();
  const data = {
    prop: DATA[type],
    sprite: ASSETS.images[type],
    player: players[0],
    stats: enemyStats
  };

  enemies.push(new enemyInstance(data, spawnPoint));
  enemies.sort((a, b) => a.pos.y - b.pos.y);
}

function enemiesAnimation(ctx, deltaTime) {
  //! refactoring later
  Saw.spawnInterval += deltaTime;
  if (Saw.spawnInterval >= random(10, 15) * 1000) { Saw.spawnInterval = 0; create(Saw); }
  Bat.spawnInterval += deltaTime;
  if (Bat.spawnInterval >= random(5, 10) * 1000) { Bat.spawnInterval = 0; create(Bat); }
  Skeleton.spawnInterval += deltaTime;
  if (Skeleton.spawnInterval >= random(10, 20) * 1000) { Skeleton.spawnInterval = 0; create(Skeleton); }

  enemies.forEach(e => {
    const sideCollision = e.animation.type == 'skeleton' ? collision([e], platforms) : undefined;
    e.draw(ctx, deltaTime);
    e.update(sideCollision);
  });

  overlap(enemies, projectiles, (enemy, projectile) => {
    if (enemy.animation.type == 'saw') { return; }

    projectiles.splice(projectiles.indexOf(projectile), 1);

    enemy.stats.health -= 1;

    if (enemy.stats.health == 0) {
      GAME.SCORE += enemy.prop.pointsForDeath;
      enemies.splice(enemies.indexOf(enemy), 1);
    }

    ASSETS.audio.enemyKill.play();

    handleScore();
  });

  removeWorldOutBounds(enemies);
}


function handleScore() {
  if (GAME.SCORE % 20 == 0 && GAME.SCORE % 100 != 0) {
    enemyStats.speed += 0.2;
    messageCreate('Enemy speed increase', 50);
  }

  if (GAME.SCORE % 10 == 0 && GAME.SCORE % 100 != 0) {
    players[0].stats.level += 1;
    spawnPerk();
    messageCreate('New Perk spawned for 15 sec', 70, 22);
  }

  if (GAME.SCORE == 100 || GAME.SCORE == 200) {
    messageCreate('Mini Boss will spawn\n after 5 seconds', 100, 38, 'orange');
  }

  if (GAME.SCORE == 300) {
    messageCreate('Final Boss will spawn\n after 5 seconds', 100, 38, 'orange');
  }
}


export {
  enemiesAnimation
};
