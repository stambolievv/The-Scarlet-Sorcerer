import data from './asset-pack.js';

export default {
    assets: data,
    display: {
        tilesheet: new Image(),
        player: new Image(),
    },
    platforms: [],
    players: [],
    keysPressed: new Set(),
    enemies: [],
    enemyStats: {
        health: 1,
        bonusHealth: 0,
        movementSpeed: 2,
    },
    projectiles: [],
    perks: [],
    textMessages: [],
};
