import Platform from './models/Platform.js';
import Player from './models/Player.js';
import { Bat, Skeleton, Saw } from './models/Enemy.js';
import Projectiles from './models/Projectile.js';
import Perk from './models/Perk.js';
import createTimer from './models/Timer.js';
import FloatingMessage from './models/FloatingMessage.js';
import data from './data/asset-pack.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });
canvas.imageSmoothingEnabled = false;
const CANVAS_WIDTH = canvas.width = 1296;
const CANVAS_HEIGHT = canvas.height = 720;
ctx.DEBUG = false;

const gameTimer = new createTimer();

let lastTime = 0;
let elapsed = 0;

const display = {
    tilesheet: new Image(),
    player: new Image(),
    perk: new Image(),
    projectile: new Image(),
    enemy: {
        bat: new Image(),
        skeleton: new Image(),
        saw: new Image(),
        claw: new Image(),
    },
};
let scorePoints = 0;
const platforms = [];
const players = [];
const keysPressed = new Set();
const enemies = [];
const enemyStats = {
    speed: 2,
};
const projectiles = [];
const perks = [];
const textMessages = [];

function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    elapsed += deltaTime;
    lastTime = timestamp;

    initBackground();
    platformsAnimation();
    playerAnimation();
    enemiesAnimation();
    projectilesAnimation();
    perkAnimation();
    messagesAnimation();
    textOnDisplay();

    requestAnimationFrame(animate);
}

//handle background
function initBackground() {
    ctx.beginPath();
    ctx.fillStyle = 'hsl(200, 30%, 50%, 0.9)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.closePath();
}

//handle platforms
function platformsCreate() {
    const tileset = data.sprites.tileset;
    display.tilesheet.src = tileset.url;

    for (let index = tileset.map.length - 1; index > -1; --index) {

        /* Get the value of each tile in the map which corresponds to the tile
            graphic index in the tileset. */
        const tileValue = tileset.map[index];

        /* If value of the tile the tile is in the ignore array skip it */
        if (tileset.ignoreFrame.includes(tileValue)) { continue; }

        /* This is the "x" and "y" location at which to cut the tile
            image out of the tileset. */
        const sourceX = (tileValue % tileset.columns) * tileset.frameWidth;
        const sourceY = Math.floor(tileValue / tileset.columns) * tileset.frameHeight;

        /* This is the "x" and "y" location at which to draw the tile image we are cutting
            from the tileset to the canvas. */
        const destinationX = (index % Math.round(CANVAS_WIDTH / tileset.frameWidth)) * tileset.frameWidth;
        const destinationY = Math.floor(index / Math.round(CANVAS_WIDTH / tileset.frameWidth)) * tileset.frameHeight;

        platforms.push(new Platform(display.tilesheet, sourceX, sourceY, destinationX, destinationY, tileset.frameWidth, tileset.frameHeight, tileValue));
    }
}
platformsCreate();
function platformsAnimation() {
    platforms.forEach(p => {
        p.draw(ctx);
    });
}
// handle player
function playerCreate() {
    const playerData = data.sprites.player;
    const painfulFrame = data.sprites.tileset.painfulFrame;
    display.player.src = playerData.url;

    players.push(new Player(playerData, display.player, painfulFrame, relativePosition(0.1, 0.65)));
}
playerCreate();
function playerAnimation() {
    const sideWorld = collideWorldBounds(players);
    const sideCollision = collision(players, platforms);

    players.forEach(p => {
        p.draw(ctx, elapsed);
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
            players[0].state = 'attack';

            projectilesCreate(e.offsetX, e.offsetY);
        }
    } else {
        messageCreate('Out of Mana. Cant cast that spell', 10, 18, 'blue');
    }

}

// handle enemies
function enemiesCreate(...types) {
    const enemyData = data.sprites.enemies;

    display.enemy.bat.src = enemyData.bat.url;
    display.enemy.skeleton.src = enemyData.skeleton.url;
    display.enemy.saw.src = enemyData.saw.url;

    const spawnPoint = relativePosition(1, 1);

    for (const type of types) {
        if (type == 'bat') {
            enemies.push(new Bat(enemyData.bat, display.enemy.bat, players[0], enemyStats, spawnPoint));
            continue;
        }
        if (type == 'skeleton') {
            enemies.push(new Skeleton(enemyData.skeleton, display.enemy.skeleton, players[0], enemyStats, spawnPoint));
            continue;
        }
        if (type == 'saw') {
            enemies.push(new Saw(enemyData.saw, display.enemy.saw, players[0], enemyStats, spawnPoint));
            continue;
        }
    }
}
// enemiesCreate();
function enemiesAnimation() {
    if (elapsed % 12 == 0) { enemiesCreate('saw'); }
    if (elapsed % 6 == 0) { enemiesCreate('bat'); }
    if (elapsed % 8 == 0) { enemiesCreate('skeleton'); }

    enemies.forEach(e => {
        const sideCollision = e.type == 'skeleton' ? collision([e], platforms) : undefined;
        e.draw(ctx, elapsed);
        e.update(sideCollision);
    });

    overlap(enemies, projectiles, (enemy, projectile) => {
        if (enemy.type == 'saw') { return; }

        projectiles.splice(projectiles.indexOf(projectile), 1);

        enemy.stats.health -= 1;

        if (enemy.stats.health == 0) {
            if (enemy.type == 'bat') {
                scorePoints += 5;
            } else {
                scorePoints += 10;
            }

            enemies.splice(enemies.indexOf(enemy), 1);
        }

        handleScore();
    });

    removeWorldOutBounds(enemies);
}

// handle projectiles
function projectilesCreate(mouseX, mouseY) {
    const projectileData = data.sprites.projectile;
    display.projectile.src = projectileData.url;

    const angle = Math.atan2(players[0].pos.y - mouseY, players[0].pos.x - mouseX);

    projectiles.push(new Projectiles(projectileData, display.projectile, players[0], angle));
}
function projectilesAnimation() {
    projectiles.forEach(p => {
        p.draw(ctx, elapsed);
        p.update();
    });

    removeWorldOutBounds(projectiles);
}

//handle perks
function perkCreate() {
    const perksData = data.sprites.perk;
    display.perk.src = perksData.url;

    const rng = Math.floor(Math.random() * 6);
    const spawnPoint = relativePosition(perksData.position[rng].x, perksData.position[rng].y);

    perks.push(new Perk(perksData, display.perk, spawnPoint));
}
function perkAnimation() {
    perks.forEach((p, i) => {
        p.draw(ctx, elapsed);
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
            player.stats.jumpBoost += 0.2;
        }

        if (perk.type.name == 'MS') {
            player.stats.movementSpeed += 0.2;
        }

        if (perk.type.name == 'FR') {
            player.stats.fireRate -= 0.2;
        }

        if (perk.type.name == 'MANA') {
            player.stats.mana += 1;
        }

        const playerCenter = { x: (player.pos.x + player.dim.w / 2) / CANVAS_WIDTH, y: (player.pos.y + player.dim.h / 2) / CANVAS_HEIGHT };
        messageCreate(perk.type.text, 100, 22, perk.type.color, playerCenter, false);

        perks.splice(perks.indexOf(perk), 1);
    });
}

// handle score
function handleScore() {
    if (scorePoints % 20 == 0 && scorePoints % 100 != 0) {
        enemyStats.speed += 0.1;
        messageCreate('Enemy speed increase', 50);
    }

    if (scorePoints % 30 == 0 && scorePoints % 100 != 0) {
        players[0].stats.level += 1;
        perkCreate();
        messageCreate('New Perk spawned for 15 sec', 70, 22);
    }

    if (scorePoints == 100 || scorePoints == 200) {
        messageCreate('Mini Boss will spawn\n after 5 seconds', 100, 38, 'orange');
    }

    if (scorePoints == 300) {
        messageCreate('Final Boss will spawn\n after 5 seconds', 100, 38, 'orange');
    }
}

// handle floating text
function messageCreate(text, priority = 0, size = 18, color = 'white', position = { x: 0.5, y: 0.3 }, fixed = true) {
    const spawnPoint = relativePosition(position.x, position.y);
    textMessages.unshift({ priority, text: new FloatingMessage(text, spawnPoint, fixed, size, color) });
}
function messagesAnimation() {
    textMessages
        .sort((a, b) => b.priority - a.priority)
        .forEach(({ text }, i) => {
            if (text.fixed) {
                const offset = CANVAS_HEIGHT * 0.3 - i * 30;
                text.pos.y = offset;
            }
            text.draw(ctx);
            text.update();
            if (text.lifeSpan > 200) { textMessages.splice(i, 1); }
        });
}

// handle text
function textOnDisplay() {
    //timer and score
    gameTimer.start();
    ctx.font = '24px customFont';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Timer: ' + gameTimer.output, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.05);
    ctx.fillText('Score: ' + scorePoints, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.09);
}

// handle game mechanics
function overlap(AA, BB, callback) {
    /*
        Collision detection with two different objects.
        By checking their sides points were : 
            top side is - pos.y
            left side is - pos.x
            bottom side is - pos.y + dim.h
            right side is - pos.x + dim.w
        Returns "a" and "b" if they touched, from "AA" and "BB" array.
    */
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
    /*
        Collision detection with different side of objects.
        The "a" from "AA" array stop because "b" from "BB" array is immovable.
    */
    const side = { top: false, bottom: false, left: false, right: false, type: undefined };
    AA.forEach(a => {
        BB.forEach(b => {
            // Get the distance for the two objects
            const dx = (a.pos.x + (a.dim.w / 2)) - (b.pos.x + (b.dim.w / 2));
            const dy = (a.pos.y + (a.dim.h / 2)) - (b.pos.y + (b.dim.h / 2));

            // Add the half widths and half heights of the objects.
            const widthHalf = (a.dim.w / 2) + (b.dim.w / 2);
            const heightHalf = (a.dim.h / 2) + (b.dim.h / 2);

            // If the "x" and "y" vector are less than the half width or half height, they we must be inside the object, causing a collision.
            if (Math.abs(dx) < widthHalf && Math.abs(dy) < heightHalf) {

                // Figures out on which side we are colliding (top, bottom, left, or right).
                const crossWidth = Math.ceil(widthHalf - Math.abs(dx)); //! ---------- 
                const crossHeight = heightHalf - Math.abs(dy);

                // Pass the value of the tile to check if its painful or not.
                side.type = b.tileValue;

                if (crossWidth > crossHeight) {
                    if (dy > 0) {
                        side.top = true;
                        a.pos.y += crossHeight;
                    } else {
                        side.bottom = true;
                        a.pos.y -= crossHeight;
                    }
                }
                if (crossWidth < crossHeight) {
                    if (dx > 0) {
                        side.left = true;
                        a.pos.x += crossWidth;
                    } else {
                        side.right = true;
                        a.pos.x -= crossWidth;
                    }
                }
                // console.log(Math.abs(dx), side.right);
            }
        });
    });
    return side;
}
function removeWorldOutBounds(AA) {
    /*
        Collision detection with outside world boundaries,
        By checking their sides points were : 
             top side is - pos.y
            left side is - pos.x
            bottom side is - pos.y + dim.h
            right side is - pos.x + dim.w
        If "a" from "AA" array goes out of screen will be deleted.
    */
    AA.forEach((a, i) => {
        if (a.pos.x + a.dim.w < 0 || a.pos.x > CANVAS_WIDTH ||
            a.pos.y + a.dim.h < 0 || a.pos.y > CANVAS_HEIGHT) {
            AA.splice(i, 1);
        }
    });
}
function collideWorldBounds(AA) {
    /*
        Collision detection with the world boundaries.
        By checking their sides points were : 
            top side is - pos.y
            left side is - pos.x
            bottom side is - pos.y + dim.h
            right side is - pos.x + dim.w
        The "a" from "AA" array can't leave the screen.
    */
    const side = { top: false, bottom: false, left: false, right: false };
    AA.forEach(a => {
        if (a.pos.y < 0) {
            side.top = true;
            a.pos.y = 0;
            a.vel.y = 0;
        }
        if (a.pos.y + a.dim.h > CANVAS_HEIGHT) {
            side.bottom = true;
            a.pos.y = CANVAS_HEIGHT - a.dim.h;
            a.vel.y = 0;
        }
        if (a.pos.x < 0) {
            side.left = true;
            a.pos.x = 0;
            a.vel.x = 0;
        }
        if (a.pos.x + a.dim.w > CANVAS_WIDTH) {
            side.right = true;
            a.pos.x = CANVAS_WIDTH - a.dim.w;
            a.vel.x = 0;
        }
    });
    return side;
}
function relativePosition(posX, posY) {
    return { x: posX * CANVAS_WIDTH, y: posY * CANVAS_HEIGHT };
}

window.addEventListener('keydown', keyPress);
window.addEventListener('keyup', keyPress);
window.addEventListener('click', onClick);
window.addEventListener('load', animate(0));
