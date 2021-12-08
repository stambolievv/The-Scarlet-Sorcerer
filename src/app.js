import Platform from './models/platforms/Platform.js';
import Player from './models/player/Player.js';
import Enemy from './models/enemies/Enemy.js';
import Projectiles from './models/player/Projectile.js';
import Perk from './models/perks/Perk.js';
import createTimer from './common/Timer.js';
import FloatingMessage from './common/FloatingMessage.js';

const ctx = document.getElementById('game').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

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
const perksData = {
    position: [
        { x: 0.40, y: 0.13 },
        { x: 0.20, y: 0.38 },
        { x: 0.85, y: 0.38 },
        { x: 0.48, y: 0.51 },
        { x: 0.08, y: 0.66 },
        { x: 0.71, y: 0.62 },
    ],
    variety: [
        { name: 'BS', text: 'Bonus Heart +1', color: '#ff471a' },
        { name: 'JB', text: 'Jump Boost Increase', color: '#66ccff' },
        { name: 'MS', text: 'Movement Speed Increase', color: '#aaff80' },
        { name: 'FR', text: 'FireRate Increase', color: '#ffcc00' },
    ]
};
const textMessages = [];

function animate() {
    requestAnimationFrame(animate);

    initBackground();
    platformsAnimation();
    playerAnimation();
    enemiesAnimation();
    projectilesAnimation();
    perkAnimation();
    messagesAnimation();
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
        new Platform(relativePosition(0, 0.95), ctx.canvas.width, 100, 1, 'ground'),
        new Platform(relativePosition(0.30, 0.17), 32, 32, 10, 'island'),
        new Platform(relativePosition(0.16, 0.42), 32, 32, 10, 'island'),
        new Platform(relativePosition(0.71, 0.42), 32, 32, 10, 'island'),
        new Platform(relativePosition(0.40, 0.55), 32, 32, 10, 'island'),
        new Platform(relativePosition(0.60, 0.66), 32, 32, 10, 'island'),
        new Platform(relativePosition(0.02, 0.70), 32, 32, 10, 'island')
    );
}
platformsCreate();
function platformsAnimation() {
    platforms.forEach(p => {
        p.draw(ctx);
    });
}

// handle player
function playerCreate() {
    players.push(new Player(relativePosition(0.5, 0.8)));
}
playerCreate();
function playerAnimation() {
    const sideWorld = collideWorldBounds(players);
    const sideCollision = collision(players, platforms);

    players.forEach(p => {
        p.draw(ctx);
        p.update(keysPressed, sideWorld, sideCollision);
        p.handleStats();
        if (p.stats._outOfOxygen) {
            messageCreate('Out of oxygen. You are taking damage', 90, 32, 'red');
        }
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
        // on keydown event
        keysPressed.add(e.code);
    } else {
        // on keyup event
        keysPressed.delete(e.code);
    }
}
function onClick(e) {
    if (players[0].stats.mana > 0) {
        if (players[0].stats._canShoot) {
            players[0].stats._canShoot = false;
            players[0].stats.mana--;
            projectilesCreate(e.offsetX, e.offsetY);
        }
    } else {
        messageCreate('Out of Mana. Cant cast that spell', 10, 20, 'blue');
    }
}

// handle enemies
function enemiesCreate() {
    handleScore();

    const spawnPoint = relativePosition(Math.random(), Math.random() * 0.2);
    enemies.push(new Enemy(players[0], spawnPoint, enemyStats));
}
enemiesCreate();
function enemiesAnimation() {
    if (enemies.length == 0) { enemiesCreate(); }

    const offset = ctx.canvas.width * 0.1;
    const sideWorld = collideWorldBounds(enemies);
    const sideCollision = collision(enemies, platforms);

    enemies.forEach(e => {
        e.draw(ctx);
        e.update(offset, sideWorld, sideCollision);
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
            const spawnPoint = relativePosition(Math.random(), Math.random() * 0.2);
            enemy.pos = { x: spawnPoint.x, y: spawnPoint.y };
        }
    });

}

// handle projectiles
function projectilesCreate(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - players[0].pos.y, mouseX - players[0].pos.x);
    projectiles.push(new Projectiles(players[0], angle));
}
function projectilesAnimation() {
    projectiles.forEach(p => {
        p.draw(ctx);
        p.update();
    });

    removeWorldOutBounds(projectiles);
}

//handle perks
window.perkCreate = perkCreate;
function perkCreate() {
    const rngPosition = Math.floor(Math.random() * 6);
    const rngType = Math.floor(Math.random() * 4);

    const spawnPoint = relativePosition(perksData.position[rngPosition].x, perksData.position[rngPosition].y);
    perks.push(new Perk(spawnPoint, perksData.variety[rngType]));
}
function perkAnimation() {
    perks.forEach((p, i) => {
        p.draw(ctx);
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
            player.stats.jumpBoost += 5;
        }

        if (perk.type.name == 'MS') {
            player.stats.movementSpeed += 1;
        }

        if (perk.type.name == 'FR') {
            player.stats.fireRate -= 0.5;
        }

        const playerCenter = { x: (player.pos.x + player.dim.w / 2), y: (player.pos.y + player.dim.h / 2) };
        messageCreate(perk.type.text, 100, 20, perk.type.color, playerCenter);

        perks.splice(perks.indexOf(perk), 1);
    });
}

// handle score
function handleScore() {
    if (scorePoints % 10 == 0 && scorePoints % 100 != 0) {
        enemyStats.movementSpeed += 0.1;
        messageCreate('Enemy movement speed increase', 50);
    }

    if (scorePoints % 30 == 0 && scorePoints % 100 != 0) {
        players[0].stats.level += 1;
        perkCreate();
        messageCreate('New Perk spawned for 15 sec', 70, 20);
    }

    if (scorePoints % 50 == 0 && scorePoints % 100 != 0) {
        enemyStats.bonusHealth += 1;
        messageCreate('Enemy hit points increase', 60);
    }

    if (scorePoints == 100 || scorePoints == 200) {
        messageCreate('Mini Boss will spawn\n after 5 seconds', 100, 48);
    }

    if (scorePoints == 300) {
        messageCreate('Final Boss will spawn\n after 5 seconds', 100, 48);
    }
}

// handle floating text
function messageCreate(text, priority = 0, size = 18, color = 'white', position = { x: 0.5, y: 0.3 }) {
    const spawnPoint = relativePosition(position.x, position.y);
    textMessages.unshift({ priority, text: new FloatingMessage(text, spawnPoint, size, color) });
}
function messagesAnimation() {
    if (textMessages.length != 0) {
        textMessages
            .sort((a, b) => b.priority - a.priority)
            .map((m, i) => Object.values(m).map((t) => console.log(t)))
            .forEach((t, i) => {
                return t;
                // const offset = i + 10;
                // t.text.pos.y -= offset;
                // t.text.draw(ctx);
                // t.text.update();
                // if (t.text.lifeSpan > 200) { textMessages.splice(i, 1); }
                // return;
            });
    }
}

// handle game physics
function overlap(AA, BB, callback) {
    // collision detection with two different objects
    // by checking their sides points
    // were : 
    //      top side is - pos.y
    //      left side is - pos.x
    //      bottom side is - pos.y + dim.h
    //      right side is - pos.x + dim.w
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
                        a.pos.y -= crossHeight;// * 2; // bouncing
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
    // by checking their sides points
    // were : 
    //      top side is - pos.y
    //      left side is - pos.x
    //      bottom side is - pos.y + dim.h
    //      right side is - pos.x + dim.w
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
    // by checking their sides points
    // were : 
    //      top side is - pos.y
    //      left side is - pos.x
    //      bottom side is - pos.y + dim.h
    //      right side is - pos.x + dim.w
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
function relativePosition(posX, posY) {
    return { x: posX * ctx.canvas.width, y: posY * ctx.canvas.height };
}

window.addEventListener('keydown', keyPress);
window.addEventListener('keyup', keyPress);
window.addEventListener('click', onClick);
window.addEventListener('load', animate);
