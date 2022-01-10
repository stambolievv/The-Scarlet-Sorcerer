import { GAME, ASSETS } from '../properties.js';
import { interfaces, players } from '../constants.js';
import { relativePosition } from '../mechanics.js';



class GUI {
  constructor(sprite, playerStats, position) {
    this.sprite = sprite;
    this.pos = { x: position.x, y: position.y };
    this.dim = { w: this.sprite.width, h: this.sprite.height };
    this.maxWidth = this.dim.w;
    this.playerStats = playerStats;
    this.state = 'default';
    this.isClicked = false;
  }
  draw(ctx) {
    ctx.drawImage(this.sprite, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

    if (ctx.DEBUG) {
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }
  update() {
    if (GAME.MOUSE.x >= this.pos.x && GAME.MOUSE.x <= this.pos.x + this.dim.w &&
      GAME.MOUSE.y >= this.pos.y && GAME.MOUSE.y <= this.pos.y + this.dim.h) {

      this.state = 'hover';

      if (GAME.MOUSE.pressed) {
        this.state = 'active';
        if (!this.isClicked) { this.isClicked = true; }
      } else {
        this.isClicked = false;
      }

    } else {
      this.state = 'default';
    }
  }
}

class HUD extends GUI {
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
class BonusBar extends GUI {
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
    this._infoText = [];
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

    ctx.textAlign = 'right';
    ctx.font = '18px rubber';
    this._infoText.forEach((t, i) => {
      ctx.fillText(t, this.pos.x * this._textPos[i].x, this.pos.y * this._textPos[i].y);
    });

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
    ctx.fillText(Math.rounddwa(this.playerStats.oxygen / 10), ctx.canvas.width * 0.511, ctx.canvas.height * 0.965);
    ctx.fillText(this.playerStats.movementSpeed.toFixed(1), ctx.canvas.width * 0.561, ctx.canvas.height * 0.965);
  }

  update() {
    super.update();
    if (GAME.statsInfo) {
      this._infoText = [
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
      this._infoText = [];
    }
  }
}

class Icon extends GUI {
  constructor(sprite, playerStats, position) {
    super(sprite, playerStats, position);
    this.text = '';
    this.shadow = { color: 'gray', blur: 10 };
  }

  draw(ctx) {
    ctx.shadowColor = this.shadow.color;
    ctx.shadowBlur = this.shadow.blur;
    super.draw(ctx);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    if (this.state == 'hover' || this.state == 'active') {
      ctx.fillText(this.text, this.pos.x + this.dim.w * 0.5, this.pos.y - 10);
    }
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
  }
}
class Menu extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.menu, playerStats, position);
    this.pos.x *= 0.94;
    this.pos.y *= 0.02;
  }
  update() {
    super.update();
    if (this.isClicked) { return GAME.paused = true; }
  }
}
class MenuBg extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.bg, playerStats, position);
    this.pos.x *= 0.5;
    this.pos.x -= this.dim.w * 0.5;
    this.pos.y *= 0.5;
    this.pos.y -= this.dim.h * 0.5;
  };

  draw(ctx) {
    super.draw(ctx);
    ctx.font = 'bold 48px rubber';
    ctx.fillText('Paused', this.pos.x * 1.53, this.pos.y * 1.26);
  }

  update() { }
}
class Back extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.back, playerStats, position);
    this.pos.x *= 0.376;
    this.pos.y *= 0.434;
    this.text = 'Go Back';
  };

  update() {
    super.update();
    if (this.isClicked) { return GAME.paused = false; }
  }
}
class Restart extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.restart, playerStats, position);
    this.pos.x *= 0.476;
    this.pos.y *= 0.434;
    this.text = 'Restart';
  };

  update() {
    super.update();
    if (this.isClicked) { return GAME.paused = false; }
  }
}
class Resume extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.resume, playerStats, position);
    this.pos.x *= 0.576;
    this.pos.y *= 0.434;
    this.text = 'Resume';
  };

  update() {
    super.update();
    if (this.isClicked) { return GAME.paused = false; }
  }
}
class Power extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.power, playerStats, position);
    this.pos.x *= 0.377;
    this.pos.y *= 0.567;
    this.text = 'Cheat Mode';
    this.playerStats = playerStats;
    this.oldStats = playerStats;
  };

  update() {
    super.update();
    if (this.isClicked) { GAME.cheatMode = !GAME.cheatMode; }

    if (GAME.cheatMode) {
      this.playerStats.level = 999;
      this.playerStats.perks = 999;
      this.playerStats.health = 999;
      this.playerStats.maxHealth = 999;
      this.playerStats.bonusHealth = 999;
      this.playerStats.maxBonusHealth = 999;
      this.playerStats.mana = 999;
      this.playerStats.maxMana = 999;
      this.playerStats.manaReg = 3;
      this.playerStats.oxygen = 9999;
      this.playerStats.maxOxygen = 9999;
      this.playerStats.jumpBoost = 20;
      this.playerStats.movementSpeed = 150;
      this.playerStats.fireRate = 0;
    } else {
      this.playerStats = this.oldStats;
    }
  }
}
class Info extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.info, playerStats, position);
    this.pos.x *= 0.476;
    this.pos.y *= 0.567;
    this.text = 'Stats Info';
  };

  update() {
    super.update();
    if (this.isClicked) { GAME.statsInfo = !GAME.statsInfo; }
  }
}
class Fps extends Icon {
  constructor(sprite, playerStats, position) {
    super(sprite.fps, playerStats, position);
    this.pos.x *= 0.576;
    this.pos.y *= 0.567;
    this.text = 'Show FPS';
  };

  update() {
    super.update();
    if (this.isClicked) { return GAME.showFps = !GAME.showFps; }
  }
}

const elements = [
  // MenuBg,
  // Restart,
  // Resume,
  // Back,
  // Power,
  // Info,
  // Fps,
  // Menu,
  Stats,
  ManaBar,
  OxygenBar,
  HealthBar,
  BonusBar,
  HUD,
];

(function create() {
  elements.forEach(i => {
    interfaces.push(new i(ASSETS.gui, players[0].stats, relativePosition(1, 1)));
  });
})();

function guiAnimation(ctx) {
  interfaces.forEach(i => {
    i.draw(ctx);
    i.update();
  });
}

export {
  guiAnimation
};