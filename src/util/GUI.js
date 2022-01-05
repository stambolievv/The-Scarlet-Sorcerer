class GUI {
  constructor(sprite, playerStats, position) {
    this.sprite = sprite;
    this.pos = { x: position.x, y: position.y };
    this.dim = { w: this.sprite.width, h: this.sprite.height };
    this.maxWidth = this.dim.w;
    this.playerStats = playerStats;
  }
  draw(ctx) {
    ctx.drawImage(this.sprite, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

    if (ctx.DEBUG) {
      ctx.beginPath();
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
      ctx.closePath();
    }
  }
  update() { }
}

class __HUD__ extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.hud, playerStats, position);
    this.pos.x *= 0.05;
    this.pos.y *= 0.15;
  }
}
class HealthBar extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.healthBar, playerStats, position);
    this.pos.x *= 0.1;
    this.pos.y *= 0.164;
  }

  update() {
    if (this.playerStats.health >= 0 && this.playerStats.health <= this.playerStats.maxHealth) {
      this.dim.w = (this.playerStats.health / this.playerStats.maxHealth) * this.maxWidth;
    }
  }
}
class _BonusBar extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.bonusBar, playerStats, position);
    this.pos.x *= 0.1;
    this.pos.y *= 0.164;
  }

  update() {
    if (this.playerStats.bonusHealth >= 0 && this.playerStats.bonusHealth <= this.playerStats.maxBonusHealth) {
      this.dim.w = (this.playerStats.bonusHealth / this.playerStats.maxBonusHealth) * this.maxWidth;
    }
  }
}
class ManaBar extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.manaBar, playerStats, position);
    this.pos.x *= 0.101;
    this.pos.y *= 0.197;
  }

  update() {
    if (this.playerStats.mana >= 0 && this.playerStats.mana <= this.playerStats.maxMana) {
      this.dim.w = (this.playerStats.mana / this.playerStats.maxMana) * this.maxWidth;
    }
  }
}
class OxygenBar extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.oxygenBar, playerStats, position);
    this.pos.x *= 0.1;
    this.pos.y *= 0.214;
  }

  update() {
    if (this.playerStats.oxygen >= 0 && this.playerStats.oxygen <= this.playerStats.maxOxygen) {
      this.dim.w = (this.playerStats.oxygen / this.playerStats.maxOxygen) * this.maxWidth;
    }
  }
}

class Stats extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.stats, playerStats, position);
    this.pos.y *= 0.889;
    this.pos.x *= 0.5;
    this.pos.x -= this.dim.w * 0.5;
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.textAlign = 'center';
    ctx.font = '14px rubber';
    ctx.fillStyle = 'white';

    ctx.fillText(this.playerStats.level, ctx.canvas.width * 0.413, ctx.canvas.height * 0.921);
    ctx.fillText(this.playerStats.health, ctx.canvas.width * 0.461, ctx.canvas.height * 0.921);
    ctx.fillText(Math.floor(this.playerStats.mana) / 10, ctx.canvas.width * 0.511, ctx.canvas.height * 0.921);
    ctx.fillText(this.playerStats.jumpBoost.toFixed(1), ctx.canvas.width * 0.561, ctx.canvas.height * 0.921);
    ctx.fillText(this.playerStats.fireRate.toFixed(1), ctx.canvas.width * 0.611, ctx.canvas.height * 0.921);

    ctx.fillText(this.playerStats.perks, ctx.canvas.width * 0.413, ctx.canvas.height * 0.965);
    ctx.fillText(this.playerStats.bonusHealth, ctx.canvas.width * 0.461, ctx.canvas.height * 0.965);
    ctx.fillText(Math.floor(this.playerStats.oxygen / 10), ctx.canvas.width * 0.511, ctx.canvas.height * 0.965);
    ctx.fillText(this.playerStats.movementSpeed.toFixed(1), ctx.canvas.width * 0.561, ctx.canvas.height * 0.965);
  }
}

export {
  __HUD__,
  _BonusBar,
  HealthBar,
  ManaBar,
  OxygenBar,
  Stats,
};