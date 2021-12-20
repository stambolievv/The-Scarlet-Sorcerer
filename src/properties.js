import data from './data/asset-pack.js';
import createTimer from './models/Timer.js';

function loadFiles(source) {
    const media = { images: {}, audio: {} };

    const totalFiles = Object.values(source).map(o => Object.values(o)).flat().length;
    let loadedFiles = 0;

    for (const type in source) {
        Object.entries(source[type]).forEach(([name, prop]) => {
            if (type == 'spritesheets') {
                media.images[name] = new Image();
                media.images[name].onload = onLoad();
                media.images[name].src = prop.src;
            }
            if (type == 'audio') {
                media.audio[name] = new Audio(prop.src);
                media.audio[name].oncanplaythrough = onLoad();
                media.audio[name].loop = prop.loop;
            }
        });
    }

    function onLoad() { if (++loadedFiles >= totalFiles) { return media; } }
    return onLoad();
};

export const gameSettings = {
    timer: new createTimer(),
    masterVolume: 0.02,
    scorePoints: 0
};

/** @type {{images: Object, audio: Object}} */
export const { images, audio } = loadFiles(data);
export const spritesheets = data.spritesheets;
export const platforms = [];
export const players = [];
export const projectiles = [];
export const perks = [];
export const keysPressed = new Set();
export const enemies = [];
export const enemyStats = { speed: 2 };
export const textMessages = [];