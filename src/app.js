import Platform from './models/platforms/Platform.js';
import Player from './models/player/Player.js';
import Enemy from './models/enemies/Enemy.js';
import Projectiles from './models/player/Projectile.js';
import Perk from './models/perks/Perk.js';
import createTimer from './common/Timer.js';
import FloatingMessage from './common/FloatingMessage.js';

export const ctx = document.getElementById('game').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
// ctx.canvas.width = 1280;
// ctx.canvas.height = 920;

const customFont = new FontFace('customFont', 'url(/static/fonts/rubber-biscuit.bold.ttf)');
customFont.load().then((font) => { document.fonts.add(font); });

const gameTimer = new createTimer();
let scorePoints = 0;

const platforms = [];
const players = [];
const keysPressed = new Set();
const enemies = [];
const enemyStats = {
    health: 1,
    bonusHealth: 0,
    movementSpeed: 2,
};
const projectiles = [];
const perks = [];
const textMessages = [];

function animate() {
    requestAnimationFrame(animate);

    initBackground();
    platformsAnimation();
    playerAnimation();
    enemiesAnimation();
    projectilesAnimation();
    perkAnimation();
    handleMessages();
}

//handle background
function initBackground() {
    //background
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'hsl(200, 30%, 50%, 0.6)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.closePath();
    //timer
    gameTimer.start();
    ctx.font = '16px customFont';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Timer: ' + gameTimer.output, ctx.canvas.width * 0.5, ctx.canvas.height * 0.05);
    //scorePoints
    ctx.fillText('Score: ' + scorePoints, ctx.canvas.width * 0.5, ctx.canvas.height * 0.02);
    ctx.restore();
}

//handle platforms
function platformsCreate() {
    platforms.push(
        new Platform(0, 0.95, ctx.canvas.width, 100, 1, 'ground'),
        new Platform(0.30, 0.17, 32, 32, 10, 'island'),
        new Platform(0.16, 0.42, 32, 32, 10, 'island'),
        new Platform(0.71, 0.42, 32, 32, 10, 'island'),
        new Platform(0.40, 0.55, 32, 32, 10, 'island'),
        new Platform(0.60, 0.66, 32, 32, 10, 'island'),
        new Platform(0.02, 0.70, 32, 32, 10, 'island')
    );
}
platformsCreate();
function platformsAnimation() {
    platforms.forEach(p => p.draw());
}

// handle player
function playerCreate() {
    players.push(new Player(ctx.canvas.width * 0.5, ctx.canvas.height * 0.8));
}
playerCreate();
function playerAnimation() {
    const sideWorld = collideWorldBounds(players);
    const sideCollision = collision(players, platforms);
    players.forEach(p => {
        p.draw();
        p.update([...keysPressed], sideWorld, sideCollision);
        p.handleStats();
    });

    overlap(players, enemies, (player, enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        if (player.stats.bonusHealth > 0) {
            player.stats.bonusHealth -= 1;
        } else {
            player.stats.health -= 1;
        }
    });
}
function keyPress(e) {
    if (e.type == 'keydown') {
        keysPressed.add(e.code);
    } else {
        keysPressed.delete(e.code);
    }
}
function onClick(e) {
    if (players[0].stats.mana > 0 && players[0].stats._canShoot) {
        players[0].stats._canShoot = false;
        players[0].stats.mana--;
        projectilesCreate(e.offsetX, e.offsetY);
    }
}

// handle enemies
function enemiesCreate() {
    handleScore();
    enemies.push(new Enemy(players[0], enemyStats));
}
enemiesCreate();
function enemiesAnimation() {
    if (enemies.length == 0) { enemiesCreate(); }

    const sideWorld = collideWorldBounds(enemies);
    const sideCollision = collision(enemies, platforms);
    enemies.forEach(e => {
        e.draw();
        e.update(sideWorld, sideCollision);
    });

    overlap(enemies, projectiles, (enemy, projectile) => {
        projectiles.splice(projectiles.indexOf(projectile), 1);
        if (enemy.stats.bonusHealth > 0) {
            enemy.stats.bonusHealth -= 1;
        } else {
            enemy.stats.health -= 1;
        }
        if (enemy.stats.health == 0) {
            scorePoints += 10;
            enemies.splice(enemies.indexOf(enemy), 1);
        } else {
            enemy.pos = { x: Math.random() * ctx.canvas.width, y: Math.random() * ctx.canvas.height * 0.2 };
        }
    });

}

// handle projectiles
function projectilesCreate(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - players[0].pos.y, mouseX - players[0].pos.x);
    projectiles.push(new Projectiles(players[0], 3, angle));
}
function projectilesAnimation() {
    projectiles.forEach(p => {
        p.draw();
        p.update();
    });
    removeWorldOutBounds(projectiles);
}

//handle perks
function perkCreate() {
    const position = Math.floor(Math.random() * 6);
    const type = Math.floor(Math.random() * 4);
    perks.push(new Perk(position, type));
}
function perkAnimation() {
    perks.forEach(p => {
        p.draw();
        p.update();
    });

    overlap(players, perks, (player, perk) => {
        if (perk.type.name == 'BS') {
            if (player.stats.health < 3) {
                player.stats.health += 1;
            } else {
                player.stats.bonusHealth += 1;
            }
            textMessages.push(new FloatingMessage(perk.type.text, 0.5, 0.35, 'customFont', 20));
        }

        if (perk.type.name == 'JB') {
            player.stats.jumpBoost += 5;
            textMessages.push(new FloatingMessage(perk.type.text, 0.5, 0.35, 'customFont', 20));
        }

        if (perk.type.name == 'MS') {
            player.stats.movementSpeed += 1;
            textMessages.push(new FloatingMessage(perk.type.text, 0.5, 0.35, 'customFont', 20));
        }

        if (perk.type.name == 'FR') {
            player.stats.fireRate -= 0.5;
            textMessages.push(new FloatingMessage(perk.type.text, 0.5, 0.35, 'customFont', 20));
        }

        perks.splice(perks.indexOf(perk), 1);
    });
}
//!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
window.perkCreate = perkCreate;
//!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// handle score and floating text
function handleScore() {
    if (scorePoints % 10 == 0 && scorePoints % 100 != 0) {
        enemyStats.movementSpeed += 0.1;
        textMessages.push(new FloatingMessage('Enemy movement speed increase!!!', 0.5, 0.4, 'customFont'));
    }
    if (scorePoints % 30 == 0 && scorePoints % 100 !== 0) {
        players[0].stats.level += 1;
        // perks();
        textMessages.push(new FloatingMessage('New Perk spawned for 15 sec!!!', 0.5, 0.35, 'customFont', 20));
    }
    if (scorePoints % 50 == 0 && scorePoints % 100 !== 0) {
        enemyStats.bonusHealth += 1;
        textMessages.push(new FloatingMessage('Enemy hit points increase!!!', 0.5, 0.3, 'customFont'));
    }
    if (scorePoints == 100 || scorePoints == 200) {
        textMessages.push(new FloatingMessage('Mini Boss will spawn\n after 5 seconds.', 0.5, 0.35, 'customFont', 48));
    }
    if (scorePoints == 300) {
        textMessages.push(new FloatingMessage('Final Boss will spawn\n after 5 seconds.', 0.5, 0.35, 'customFont', 48));
    }
}
function handleMessages() {
    textMessages.forEach((t, i) => {
        t.draw();
        t.update();
        if (t.lifeSpan > 100) { textMessages.splice(i, 1); }
    });
}

// handle game physics
function overlap(AA, BB, callback) {
    // collision detection with two different objects
    // returns a and b if they touched, from AA and BB array
    AA.forEach(a => {
        BB.forEach(b => {
            if (a.pos.x < b.pos.x + b.dim.w && a.pos.x + a.dim.w > b.pos.x &&
                a.pos.y < b.pos.y + b.dim.h && a.pos.y + a.dim.h > b.pos.y) {
                return callback(a, b);
            }
        });
    });
}
function collision(AA, BB) {
    // collision detection with different side of objects
    // a from AA array stop because b from BB array is immovable
    const side = { top: false, bottom: false, left: false, right: false, type: undefined };
    AA.forEach(a => {
        BB.forEach(b => {
            const dx = (a.pos.x + (a.dim.w / 2)) - (b.pos.x + (b.dim.w / 2));
            const dy = (a.pos.y + (a.dim.h / 2)) - (b.pos.y + (b.dim.h / 2));
            // add the half widths and half heights of the objects
            const widthHalf = (a.dim.w / 2) + (b.dim.w / 2);
            const heightHalf = (a.dim.h / 2) + (b.dim.h / 2);
            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(dx) < widthHalf && Math.abs(dy) < heightHalf) {
                // figures out on which side we are colliding (top, bottom, left, or right)
                const crossWidth = widthHalf - Math.abs(dx);
                const crossHeight = heightHalf - Math.abs(dy);
                side.type = b.type;
                if (crossWidth >= crossHeight) {
                    if (dy > 0) {
                        side.top = true;
                        a.pos.y += crossHeight;
                    } else {
                        side.bottom = true;
                        a.pos.y -= crossHeight; // * 2; // bouncing
                    }
                }
                if ((crossWidth < crossHeight)) {
                    if (dx > 0) {
                        side.left = true;
                        a.pos.x += crossWidth;
                    } else {
                        side.right = true;
                        a.pos.x -= crossWidth;
                    }
                }
            }
        });
    });
    return side;
}
function removeWorldOutBounds(AA) {
    // collision detection with outside world boundaries 
    // if a from AA array goes out of screen will be deleted
    AA.forEach((a, i) => {
        if (a.pos.x + a.dim.w < 0 || a.pos.x > ctx.canvas.width ||
            a.pos.y + a.dim.h < 0 || a.pos.y > ctx.canvas.height) {
            AA.splice(i, 1);
        }
    });
}
function collideWorldBounds(AA) {
    // collision detection with the world boundaries 
    // a from AA array can't leave the screen
    const side = { top: false, bottom: false, left: false, right: false };
    AA.forEach(a => {
        if (a.pos.y < 0) {
            side.top = true;
            a.pos.y = 0;
            a.vel.y = 0;
        }
        if (a.pos.y + a.dim.h > ctx.canvas.height) {
            side.bottom = true;
            a.pos.y = ctx.canvas.height - a.dim.h;
            a.vel.y = 0;
        }
        if (a.pos.x < 0) {
            side.left = true;
            a.pos.x = 0;
            a.vel.x = 0;
        }
        if (a.pos.x + a.dim.w > ctx.canvas.width) {
            side.right = true;
            a.pos.x = ctx.canvas.width - a.dim.w;
            a.vel.x = 0;
        }
    });
    return side;
}

window.addEventListener('keydown', keyPress);
window.addEventListener('keyup', keyPress);
window.addEventListener('click', onClick);
window.addEventListener('load', animate);