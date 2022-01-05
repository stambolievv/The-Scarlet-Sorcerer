class Enemy {
  constructor(data, position) {
    this.prop = data.prop;
    this.sprite = data.sprite;
    this.player = data.player;
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

  draw(ctx, elapsed) {
    const position = Math.floor(elapsed * 0.01) % this.prop.animations[(this.animation.type + this.animation.orientation)].loc.length;
    const frameX = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].x;
    const frameY = this.prop.animations[(this.animation.type + this.animation.orientation)].loc[position].y;

    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x - this.dim.w * 0.3, this.pos.y - this.dim.h * 0.3, this.prop.frameWidth, this.prop.frameHeight);

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
  constructor(data, position) {
    super(data, position);
    this.props = this.animation.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
    this.pos.x = this.props.spawn;
    this.pos.y *= (Math.random() * (0.7 - 0.1) + 0.1);
  }

  update() {
    this.pos.x += this.props.movement * (Math.random() * this.stats.speed);
    this.pos.y += Math.sin(Math.random() * 4 - 5);
  }
}

export class Skeleton extends Enemy {
  constructor(data, position) {
    super(data, position);
    this.pos.x *= Math.random() * (0.9 - 0.1) + 0.1;
    this.pos.y *= Math.random() * (0.3 - 0.15) + 0.15;
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

export class Saw extends Enemy {
  constructor(data, position) {
    super(data, position);
    this.props = this.animation.orientation == 'Left' ? { spawn: this.pos.x, movement: -1 } : { spawn: -this.dim.w, movement: 1 };
    this.pos.x = this.props.spawn;
    this.pos.y *= Math.random() * (0.7 - 0.1) + 0.1;
  }

  update() {
    this.pos.x += this.props.movement * 10;
    this.vel.y += this.gravity.y / 2;
    this.pos.y += this.vel.y;
  }
}