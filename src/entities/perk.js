import { GAME, ASSETS, DATA } from '../properties.js';
import { perks, players } from '../constants.js';
import { overlap, relativePosition, random } from '../mechanics.js';
import { messageCreate } from '../util/floatingMessage.js';

class Perk {
  constructor(data, position) {
    this.prop = data.prop;
    this.sprite = data.sprite;
    this.pos = { x: position.x, y: position.y };
    this.dim = { w: 24, h: 24 };
    this.animation = {
      elapsed: 0,
      type: this.prop.variety[random(0, this.prop.variety.length - 1)],
      orientation: ''
    };
    this.theta = 0;
  }

  draw(ctx, deltaTime) {
    this.animation.elapsed += deltaTime * 0.005;

    const position = Math.floor(this.animation.elapsed) % this.prop.animations[this.animation.type.name].loc.length;
    const frameX = this.prop.animations[this.animation.type.name].loc[position].x;
    const frameY = this.prop.animations[this.animation.type.name].loc[position].y;

    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x, this.pos.y, this.prop.frameWidth, this.prop.frameHeight);

    if (GAME.DEBUG) {
      ctx.strokeStyle = this.animation.type.color;
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }

  update() {
    this.theta += Math.PI / 60;
    const scale = Math.sin(this.theta);
    this.pos.y += scale * 0.5;
  }
}

function spawnPerk() {
  const data = {
    prop: DATA.perk,
    sprite: ASSETS.images.perk
  };

  const rng = random(0, 5);
  const spawnPoint = relativePosition(data.prop.position[rng].x, data.prop.position[rng].y);

  perks.push(new Perk(data, spawnPoint));
}

function perkAnimation(ctx, deltaTime) {
  perks.forEach((p, i) => {
    p.draw(ctx, deltaTime);
    p.update();
    if (p.theta > 50) { perks.splice(i, 1); }
  });

  overlap(players, perks, (player, perk) => {

    switch (perk.animation.type.name) {

      case 'BS':
        if (player.stats.health < player.stats.maxHealth) {
          player.stats.health += 1;
        } else {
          player.stats.bonusHealth += 1;
        }
        break;

      case 'JB':
        player.stats.jumpBoost += 0.2;
        player.stats.jumpBoost = Number(player.stats.jumpBoost.toFixed(1));
        break;

      case 'MS':
        player.stats.movementSpeed += 0.2;
        player.stats.movementSpeed = Number(player.stats.movementSpeed.toFixed(1));
        break;

      case 'FR':
        player.stats.fireRate -= 0.2;
        player.stats.fireRate = Number(player.stats.fireRate.toFixed(1));
        break;

      case 'MANA':
        player.stats.manaReg += 0.01;
        player.stats.manaReg = Number(player.stats.manaReg.toFixed(2));
        break;

      default: break;
    }

    const playerCenter = { x: (player.pos.x + player.dim.w * 0.5) / GAME.WIDTH, y: (player.pos.y + player.dim.h * 0.5) / GAME.HEIGHT };
    messageCreate(perk.animation.type.text, 100, 24, perk.animation.type.color, playerCenter, false);

    player.stats.perks += 1;
    ASSETS.audio.collect.play();

    perks.splice(perks.indexOf(perk), 1);
  });
}

export {
  spawnPerk,
  perkAnimation
};
