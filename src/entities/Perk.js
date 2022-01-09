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
    this.type = this.prop.variety[random(0, this.prop.variety.length - 1)];
    this.theta = 0;
  }

  draw(ctx, elapsed) {
    const position = Math.floor(elapsed * 0.01) % this.prop.animations[this.type.name].loc.length;
    const frameX = this.prop.animations[this.type.name].loc[position].x;
    const frameY = this.prop.animations[this.type.name].loc[position].y;

    ctx.drawImage(this.sprite, frameX, frameY, this.prop.frameWidth, this.prop.frameHeight, this.pos.x, this.pos.y, this.prop.frameWidth, this.prop.frameHeight);

    if (ctx.DEBUG) {
      ctx.strokeStyle = this.type.color;
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
  const perksData = {
    prop: DATA.perk,
    sprite: ASSETS.images.perk
  };

  const rng = random(0, 5);
  const spawnPoint = relativePosition(perksData.prop.position[rng].x, perksData.prop.position[rng].y);

  perks.push(new Perk(perksData, spawnPoint));
}

function perkAnimation(ctx, elapsed) {
  perks.forEach((p, i) => {
    p.draw(ctx, elapsed);
    p.update();
    if (p.theta > 50) { perks.splice(i, 1); }
  });

  overlap(players, perks, (player, perk) => {
    if (perk.type.name == 'BS') {
      if (player.stats.health < 3) {
        player.stats.health += 1;
      } else {
        player.stats.bonusHealth += 1;
      }
    }

    if (perk.type.name == 'JB') {
      player.stats.jumpBoost += 0.2;
    }

    if (perk.type.name == 'MS') {
      player.stats.movementSpeed += 0.2;
    }

    if (perk.type.name == 'FR') {
      player.stats.fireRate -= 0.2;
    }

    if (perk.type.name == 'MANA') {
      player.stats.manaReg += 0.01;
    }

    const playerCenter = { x: (player.pos.x + player.dim.w / 2) / GAME.WIDTH, y: (player.pos.y + player.dim.h / 2) / GAME.HEIGHT };
    messageCreate(perk.type.text, 100, 22, perk.type.color, playerCenter, false);
    player.stats.perks += 1;
    ASSETS.audio.collect.play();

    perks.splice(perks.indexOf(perk), 1);
  });
}

export {
  spawnPerk,
  perkAnimation
};