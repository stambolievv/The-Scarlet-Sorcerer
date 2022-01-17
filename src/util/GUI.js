import { GAME, ASSETS } from '../properties.js';
import { interfaces, players } from '../constants.js';
import { relativePosition } from '../mechanics.js';

class GUI {
  constructor(sprite, player, position) {
    this.sprite = sprite;
    this.pos = { x: position.x, y: position.y };
    this.dim = { w: this.sprite.width, h: this.sprite.height };
    this.maxWidth = this.dim.w;
    this.playerStats = player.stats;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.pos.x, this.pos.y, this.dim.w, this.dim.h);

    if (GAME.DEBUG) {
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }

  update() { }
}

class HUD extends GUI {
  constructor(sprite, player, position) {
    super(sprite.hud, player, position);
    this.pos.x *= 0.05;
    this.pos.y *= 0.15;
  }
}
class HealthBar extends GUI {
  constructor(sprite, player, position) {
    super(sprite.healthBar, player, position);
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
  constructor(sprite, player, position) {
    super(sprite.bonusBar, player, position);
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
  constructor(sprite, player, position) {
    super(sprite.manaBar, player, position);
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
  constructor(sprite, player, position) {
    super(sprite.oxygenBar, player, position);
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
  constructor(sprite, player, position) {
    super(sprite.stats, player, position);
    this.pos.y *= 0.889;
    this.pos.x *= 0.5;
    this.pos.x -= this.dim.w * 0.5;
    this.statsInfoText = [];
    this.textPos = [
      { x: 0.26, y: 1.04 },
      { x: 0.26, y: 1.10 },
      { x: 0.66, y: 1.04 },
      { x: 0.66, y: 1.10 },
      { x: 0.96, y: 1.04 },
      { x: 0.96, y: 1.10 },
      { x: 2.16, y: 1.04 },
      { x: 2.16, y: 1.10 },
      { x: 2.56, y: 1.04 },
    ];
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.textAlign = 'right';
    ctx.font = '22px Vanderick';
    ctx.fillStyle = 'white';
    this.statsInfoText.forEach((t, i) => {
      ctx.fillText(t, this.pos.x * this.textPos[i].x, this.pos.y * this.textPos[i].y);
    });

    ctx.textAlign = 'center';
    ctx.font = '16px Vanderick';
    ctx.fillStyle = 'white';
    ctx.fillText(this.playerStats.level, GAME.WIDTH * 0.413, GAME.HEIGHT * 0.921);
    ctx.fillText(this.playerStats.health, GAME.WIDTH * 0.461, GAME.HEIGHT * 0.921);
    ctx.fillText(Math.floor(this.playerStats.mana) / 10, GAME.WIDTH * 0.511, GAME.HEIGHT * 0.921);
    ctx.fillText(this.playerStats.jumpBoost, GAME.WIDTH * 0.561, GAME.HEIGHT * 0.921);
    ctx.fillText(this.playerStats.fireRate, GAME.WIDTH * 0.611, GAME.HEIGHT * 0.921);
    ctx.fillText(this.playerStats.perks, GAME.WIDTH * 0.413, GAME.HEIGHT * 0.965);
    ctx.fillText(this.playerStats.bonusHealth, GAME.WIDTH * 0.461, GAME.HEIGHT * 0.965);
    ctx.fillText(Math.round(this.playerStats.oxygen / 10), GAME.WIDTH * 0.511, GAME.HEIGHT * 0.965);
    ctx.fillText(this.playerStats.movementSpeed, GAME.WIDTH * 0.561, GAME.HEIGHT * 0.965);
  }

  update() {
    if (!GAME.showStats) { return this.statsInfoText = []; }
    this.statsInfoText = [
      `Level: ${this.playerStats.level}`,
      `Perks: ${this.playerStats.perks}`,
      `Health: ${this.playerStats.health}`,
      `Bonus Health: ${this.playerStats.bonusHealth}`,
      `Mana: ${Math.floor(this.playerStats.mana) / 10}`,
      `Oxygen: ${Math.round(this.playerStats.oxygen / 10)}`,
      `Jump Boost: ${this.playerStats.jumpBoost.toFixed(1)}`,
      `Movement Speed: ${this.playerStats.movementSpeed.toFixed(1)}`,
      `Fire Rate: ${this.playerStats.fireRate.toFixed(1)}`,
    ];
  }
}

class Icon extends GUI {
  constructor(sprite, player, position) {
    super(sprite, player, position);
    this.state = 'default';
    this.isClicked = false;
    this.active = false;
    this.hover = { text: '', size: 18 };
    this.shadow = { color: 'gray', blur: 10 };
  }

  draw(ctx) {
    ctx.shadowColor = this.shadow.color;
    ctx.shadowBlur = this.shadow.blur;
    super.draw(ctx);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    if (this.state == 'hover' || this.state == 'active') {
      ctx.font = `${this.hover.size}px Vanderick`;
      ctx.fillStyle = 'white';
      ctx.fillText(this.hover.text, this.pos.x + this.dim.w * 0.5, this.pos.y - this.hover.size / 3);
    }
  }

  update() {
    if (GAME.MOUSE.x >= this.pos.x && GAME.MOUSE.x <= this.pos.x + this.dim.w &&
      GAME.MOUSE.y >= this.pos.y && GAME.MOUSE.y <= this.pos.y + this.dim.h) {

      GAME.MOUSE.onMenu = true;

      this.state = 'hover';
      this.shadow.color = this.active ? 'lime' : 'white';
      this.shadow.blur = this.active ? 10 : 5;

      if (GAME.MOUSE.pressed) {
        this.state = 'active';
        if (!this.isClicked) { this.isClicked = true; }
      } else {
        this.isClicked = false;
      }

    } else {
      this.state = 'default';
      this.shadow.color = this.active ? 'lime' : 'gray';
      this.shadow.blur = this.active ? 10 : 5;
    }
  }
}

class Restart extends Icon {
  constructor(sprite, player, position) {
    super(sprite.restart, player, position);
    this.pos.x *= 0.5;
    this.pos.y *= 0.6;
    this.pos.x -= this.dim.w * 0.5;
    this.hover = { text: 'Restart', size: 60 };
  };

  draw(ctx) {
    if (GAME.GAMEOVER) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
      ctx.font = `${this.hover.size * 2}px Vanderick`;
      ctx.fillStyle = 'white';
      ctx.fillText('YOU DIED!', this.pos.x + this.dim.w * 0.5, this.pos.y * 0.8);
      super.draw(ctx);
    }
  }

  update() {
    if (GAME.GAMEOVER) {
      super.update();
      if (this.isClicked) { window.location.reload(); }
    }
  }
}
class Resume extends Icon {
  constructor(sprite, player, position) {
    super(sprite.resume, player, position);
    this.pos.x *= 0.5;
    this.pos.y *= 0.6;
    this.pos.x -= this.dim.w * 0.5;
    this.hover = { text: 'Play', size: 60 };
  };

  draw(ctx) {
    if (GAME.PAUSE) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);
      ctx.font = `${this.hover.size * 2}px Vanderick`;
      ctx.fillStyle = 'white';
      ctx.fillText('Game is paused!', this.pos.x + this.dim.w * 0.5, this.pos.y * 0.8);
      super.draw(ctx);
    }
  }

  update() {
    if (GAME.PAUSE) {
      super.update();
      if (this.isClicked) {
        this.isClicked = false;
        GAME.PAUSE = false;
      }
    }
  }
}
class Pause extends Icon {
  constructor(sprite, player, position) {
    super(sprite.pause, player, position);
    this.pos.x *= 0.95;
    this.pos.y *= 0.04;
    this.hover.text = 'Pause';
  };

  update() {
    super.update();
    if (this.isClicked && !GAME.GAMEOVER) { onClick('PAUSE'); }
  }
}
class Mute extends Icon {
  constructor(sprite, player, position) {
    super(sprite.mute, player, position);
    this.pos.x *= 0.14;
    this.pos.y *= 0.04;
    this.hover.text = 'Unmute';
    this.active = true;
  };

  update() {
    super.update();
    this.hover.text = this.active ? 'Unmute' : 'Mute';
    if (this.isClicked) { this.active = onClick('MUTE'); }
  }
}
class Debug extends Icon {
  constructor(sprite, player, position) {
    super(sprite.debug, player, position);
    this.pos.x *= 0.02;
    this.pos.y *= 0.04;
    this.hover.text = 'DEBUG';
  };

  update() {
    super.update();
    if (this.isClicked) { this.active = onClick('DEBUG'); }
  }
}
class Fps extends Icon {
  constructor(sprite, player, position) {
    super(sprite.fps, player, position);
    this.pos.x *= 0.05;
    this.pos.y *= 0.04;
    this.hover.text = 'Show FPS';
  };

  update() {
    super.update();
    if (this.isClicked) { this.active = onClick('showFps'); }
  }
}
class Info extends Icon {
  constructor(sprite, player, position) {
    super(sprite.info, player, position);
    this.pos.x *= 0.08;
    this.pos.y *= 0.04;
    this.hover.text = 'Show Stats';
  };

  update() {
    super.update();
    if (this.isClicked) { this.active = onClick('showStats'); }
  }
}
class Power extends Icon {
  constructor(sprite, player, position) {
    super(sprite.power, player, position);
    this.pos.x *= 0.11;
    this.pos.y *= 0.04;
    this.hover.text = 'Immortal';
  };

  update() {
    super.update();
    if (this.isClicked) { this.active = onClick('immortal'); }
  }
}

const ui = [
  Power,
  Info,
  Fps,
  Debug,
  Mute,
  Pause,
  Stats,
  ManaBar,
  OxygenBar,
  HealthBar,
  BonusBar,
  HUD,
  Resume,
  Restart,
];

let buttonDelay = 0;

(function create() {
  ui.forEach(i => {
    interfaces.push(new i(ASSETS.gui, players[0], relativePosition(1, 1)));
  });
})();

function guiComponents(ctx, deltaTime) {
  GAME.MOUSE.onMenu = false;

  interfaces.forEach(i => {
    i.draw(ctx);
    i.update();
  });

  buttonDelay += deltaTime;
}

function onClick(prop) {
  if (buttonDelay >= 250) {
    buttonDelay = 0;
    GAME[prop] = !GAME[prop];
    ASSETS.audio.click.play();
  }
  return GAME[prop];
}

export {
  guiComponents 
};