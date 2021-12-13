const frameWidth = 166; // height ÷ rows
const frameHeight = 136; // width ÷ columns 
const spriteAnimation = [];
const animationState = [
    { name: 'ultimateLeft', frames: 8 },
    { name: 'ultimateRight', frames: 8 },
    { name: 'attackLeft', frames: 8 },
    { name: 'attackRight', frames: 8 },
    { name: 'deathLeft', frames: 7 },
    { name: 'deathRight', frames: 7 },
    { name: 'fallLeft', frames: 2 },
    { name: 'fallRight', frames: 2 },
    { name: 'hitLeft', frames: 4 },
    { name: 'hitRight', frames: 4 },
    { name: 'idleLeft', frames: 6 },
    { name: 'idleRight', frames: 6 },
    { name: 'jumpLeft', frames: 2 },
    { name: 'jumpRight', frames: 2 },
    { name: 'runLeft', frames: 8 },
    { name: 'runRight', frames: 8 }
];

const result = animationState.forEach((state, row) => {
    const frames = { loc: [] };

    for (let col = 0; col < state.frames; col++) {
        const positionX = col * frameWidth;
        const positionY = row * frameHeight;
        frames.loc.push({ x: positionX, y: positionY });
    }

    spriteAnimation[state.name] = frames;
});

let output = '';

for (const iterator in spriteAnimation) {
    output += `'${iterator}': ${JSON.stringify(spriteAnimation[iterator])},\n`;
}

console.log(output.split('"').join("'"));