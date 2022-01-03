export default class GUI {
    constructor(data, position) {
        this.sprites = data.sprites;
        this.player = data.player;
        this.pos = { x: position.x, y: position.y };
        this.stats = {
            health: this.player.stats.health,
            maxHealth: 3,
            bonusHealth: this.player.stats.bonusHealth,
            maxBonusHealth: 5,
            mana: this.player.stats.mana,
            maxMana: 5,
            oxygen: this.player.stats.oxygen,
            maxOxygen: 3
        };
        this.elements = [
            new HealthBar(this.sprites.healthBar, this.pos, this.stats),
            new BonusBar(this.sprites.bonusBar, this.pos, this.stats),
            new ManaBar(this.sprites.manaBar, this.pos, this.stats),
            new OxygenBar(this.sprites.oxygenBar, this.pos, this.stats),
            new HUD(this.sprites.hud, this.pos, this.stats),
        ];
    }
}

class HUD {
    constructor(sprite, position, stats) {
        this.sprite = sprite;
        this.pos = position;
        this.stats = stats;
        this.dim = { w: this.sprite.width, h: this.sprite.height };
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.pos.x * 0.05, this.pos.y * 0.15, this.dim.w, this.dim.h);
    }
    update() { }
}
class HealthBar {
    constructor(sprite, position, stats) {
        this.sprite = sprite;
        this.pos = position;
        this.stats = stats;
        this.dim = { w: this.sprite.width, h: this.sprite.height };
    }
    draw(ctx) {
        const width = (this.stats.health / this.stats.maxHealth) * this.dim.w;
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.165, width, this.dim.h * 0.9);
    }
    update(playerStats) {
        this.stats.health = playerStats.health;
    }
}
class BonusBar {
    constructor(sprite, position, stats) {
        this.sprite = sprite;
        this.pos = position;
        this.stats = stats;
        this.dim = { w: this.sprite.width, h: this.sprite.height };
    }
    draw(ctx) {
        const width = (this.stats.bonusHealth / this.stats.maxBonusHealth) * this.dim.w;
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.165, width, this.dim.h * 0.9);
    }
    update(playerStats) {
        this.stats.bonusHealth = playerStats.bonusHealth;
    }
}
class ManaBar {
    constructor(sprite, position, stats) {
        this.sprite = sprite;
        this.pos = position;
        this.stats = stats;
        this.dim = { w: this.sprite.width, h: this.sprite.height };
    }
    draw(ctx) {
        const width = (this.stats.mana / this.stats.maxMana) * this.dim.w;
        ctx.drawImage(this.sprite, this.pos.x * 0.101, this.pos.y * 0.199, width, this.dim.h);
    }
    update(playerStats) {
        this.stats.mana = playerStats.mana;
    }
}
class OxygenBar {
    constructor(sprite, position, stats) {
        this.sprite = sprite;
        this.pos = position;
        this.stats = stats;
        this.dim = { w: this.sprite.width, h: this.sprite.height };
    }
    draw(ctx) {
        const width = (this.stats.oxygen / this.stats.maxOxygen) * this.dim.w;
        ctx.drawImage(this.sprite, this.pos.x * 0.1, this.pos.y * 0.214, width, this.dim.h);
    }
    update(playerStats) {
        this.stats.oxygen = playerStats.oxygen;
    }
}