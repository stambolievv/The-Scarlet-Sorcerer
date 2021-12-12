const frameWidth = 166; // height ÷ rows
const frameHeight = 136; // width ÷ columns 
const spriteAnimation = [];
const animationState = [
    {
        name: 'attack1',
        frames: 8
    },
    {
        name: 'attack2',
        frames: 8
    },
    {
        name: 'death',
        frames: 7
    },
    {
        name: 'fall',
        frames: 2
    },
    {
        name: 'hit',
        frames: 4
    },
    {
        name: 'idle',
        frames: 6
    },
    {
        name: 'jump',
        frames: 2
    },
    {
        name: 'run',
        frames: 8
    }
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