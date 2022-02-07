import { particles } from '../constants.js';
import { random } from '../mechanics.js';

class Particle {
  constructor(position) {
    this.pos = { x: position.x, y: position.y };
    this.vel = { x: random(-5, 5), y: random(-5, 5) };
    this.dim = { w: random(2, 5), h: random(2, 5) };
    this.gravity = { x: 0, y: 0.5 };
    this.friction = { x: 0.92, y: 0.90 };
    this.color = `hsl(${random(20, 60)}, 100%, 50%)`;
    this.lifeSpan = 0;
    this.opacity = 1;
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    ctx.globalAlpha = 1;
  }

  update(deltaTime) {
    this.lifeSpan += deltaTime * 0.05;
    if (this.opacity > 0.01) { this.opacity -= deltaTime * 0.0025; }

    this.vel.x += this.gravity.x;
    this.vel.y += this.gravity.y;
    this.vel.x *= this.friction.x;
    this.vel.y *= this.friction.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

function spawnParticles(posX, posY, range) {
  for (let i = 0; i < range; i++) {
    particles.push(new Particle({ x: posX, y: posY }));
  }
}

function particlesAnimation(ctx, deltaTime) {
  particles.forEach((p, i) => {
    p.draw(ctx);
    p.update(deltaTime);
    if (p.lifeSpan > 20) { particles.splice(i, 1); }
  });
}

export {
  spawnParticles,
  particlesAnimation
};
