class GUI {
    constructor(sprite, playerStats, position) {
        this.sprite = sprite;
        this.pos = { x: position.x, y: position.y };
        this.dim = { w: this.sprite.width, h: this.sprite.height };
        this.maxWidth = this.dim.w;
        this.playerStats = playerStats;
    }
    draw() { }
    update() { }
}

class __HUD__ extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.hud, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.05, this.pos.y * 0.15, this.dim.w, this.dim.h);
    }
}
class _HealthBar extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.healthBar, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.165, this.dim.w, this.dim.h * 0.9);
    }
    update() {
        if (this.playerStats.health >= 0) {
            this.dim.w = (this.playerStats.health / this.playerStats.maxHealth) * this.maxWidth;
        }
    }
}
class __BonusBar extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.bonusBar, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.165, this.dim.w, this.dim.h * 0.86);
    }
    update() {
        if (this.playerStats.bonusHealth >= 0) {
            this.dim.w = (this.playerStats.bonusHealth / this.playerStats.maxBonusHealth) * this.maxWidth;
        }
    }
}
class ManaBar extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.manaBar, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.101, this.pos.y * 0.199, this.dim.w, this.dim.h);
    }
    update() {
        if (this.playerStats.mana >= 0) {
            this.dim.w = (this.playerStats.mana / this.playerStats.maxMana) * this.maxWidth;
        }
    }
}
class OxygenBar extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.oxygenBar, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.214, this.dim.w, this.dim.h);
    }
    update() {
        if (this.playerStats.oxygen >= 0) {
            this.dim.w = (this.playerStats.oxygen / this.playerStats.maxOxygen) * this.maxWidth;
        }
    }
}

class Stats extends GUI {
    constructor(sprite, playerStats, position) {
        super(sprite.stats, playerStats, position);
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.5 - this.dim.w * 0.5, this.pos.y * 0.889, this.dim.w, this.dim.h);

        ctx.textAlign = 'center';
        ctx.font = '14px rubber';
        ctx.fillStyle = 'white';

        ctx.fillText(this.playerStats.level, ctx.canvas.width * 0.413, ctx.canvas.height * 0.921);
        ctx.fillText(this.playerStats.health, ctx.canvas.width * 0.461, ctx.canvas.height * 0.921);
        ctx.fillText(Math.trunc(this.playerStats.mana) / 10, ctx.canvas.width * 0.511, ctx.canvas.height * 0.921);
        ctx.fillText(this.playerStats.jumpBoost.toFixed(1), ctx.canvas.width * 0.561, ctx.canvas.height * 0.921);
        ctx.fillText(this.playerStats.fireRate.toFixed(1), ctx.canvas.width * 0.611, ctx.canvas.height * 0.921);

        ctx.fillText(this.playerStats.perks, ctx.canvas.width * 0.413, ctx.canvas.height * 0.965);
        ctx.fillText(this.playerStats.bonusHealth, ctx.canvas.width * 0.461, ctx.canvas.height * 0.965);
        ctx.fillText(Math.trunc(this.playerStats.oxygen / 10), ctx.canvas.width * 0.511, ctx.canvas.height * 0.965);
        ctx.fillText(this.playerStats.movementSpeed.toFixed(1), ctx.canvas.width * 0.561, ctx.canvas.height * 0.965);
    }
}

export {
    __HUD__,
    _HealthBar,
    __BonusBar,
    ManaBar,
    OxygenBar,
    Stats,
};