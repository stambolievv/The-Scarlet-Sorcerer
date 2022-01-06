import { gameSettings } from '../properties.js';

class GUI {
  constructor(sprite, playerStats, position) {
    this.sprite = sprite;
    this.pos = { x: position.x, y: position.y };
    this.dim = { w: this.sprite.width, h: this.sprite.height };
    this.maxWidth = this.dim.w;
    this.playerStats = playerStats;
    this.state = 'default';
  }
  draw(ctx) {
    ctx.drawImage(this.sprite, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

    if (ctx.DEBUG) {
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }
  update() {
    if (gameSettings.mouse.x >= this.pos.x && gameSettings.mouse.x <= this.pos.x + this.dim.w &&
      gameSettings.mouse.y >= this.pos.y && gameSettings.mouse.y <= this.pos.y + this.dim.h) {
      if (gameSettings.mouse.pressed) { return this.state = 'active'; }
      return this.state = 'hover';
    } else {
      return this.state = 'default';
    }
  }
}

class __HUD__ extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.hud, playerStats, position);
    this.pos.x *= 0.05;
    this.pos.y *= 0.15;
  }
  update() { }
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
    this._hoverText = [];
    this._textPos = [
      { x: 0.26, y: 1.03 },
      { x: 0.26, y: 1.09 },
      { x: 0.66, y: 1.03 },
      { x: 0.66, y: 1.09 },
      { x: 0.96, y: 1.03 },
      { x: 0.96, y: 1.09 },
      { x: 2.16, y: 1.03 },
      { x: 2.16, y: 1.09 },
      { x: 2.56, y: 1.03 },
    ];
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

    this._hoverText.forEach((t, i) => {
      ctx.textAlign = 'right';
      ctx.font = '18px rubber';
      ctx.fillText(t, this.pos.x * this._textPos[i].x, this.pos.y * this._textPos[i].y);
    });
  }

  update() {
    super.update();
    if (this.state == 'hover' || this.state == 'active') {
      this._hoverText = [
        `Level: ${this.playerStats.level}`,
        `Perks: ${this.playerStats.perks}`,
        `Health: ${this.playerStats.health}`,
        `Bonus Health: ${this.playerStats.bonusHealth}`,
        `Mana: ${Math.floor(this.playerStats.mana) / 10}`,
        `Oxygen: ${Math.floor(this.playerStats.oxygen / 10)}`,
        `Jump Boost: ${this.playerStats.jumpBoost.toFixed(1)}`,
        `Movement Speed: ${this.playerStats.movementSpeed.toFixed(1)}`,
        `Fire Rate: ${this.playerStats.fireRate.toFixed(1)}`,
      ];
    } else {
      this._hoverText = [];
    }
  }
}


class Menu extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite.menu, playerStats, position);
    this.pos.x *= 0.95;
    this.pos.y *= 0.02;
    this.dim.w *= 1.3;
    this.dim.h *= 1.3;
    this.isClicked = false;
    this.shadow = {
      color: 'gray',
      blur: 10
    };
  }

  draw(ctx) {
    ctx.shadowColor = this.shadow.color;
    ctx.shadowBlur = this.shadow.blur;
    super.draw(ctx);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  update() {
    super.update();
    if (this.state == 'hover' || this.state == 'active') {
      this.shadow.color = 'white';
      this.shadow.blur = 20;
    } else {
      this.shadow.color = 'gray';
      this.shadow.blur = 10;
    }
    if (this.state == 'active') { gameSettings.state = 'pause'; }
  }
}

export {
  __HUD__,
  _BonusBar,
  HealthBar,
  ManaBar,
  OxygenBar,
  Stats,
  Menu,
};