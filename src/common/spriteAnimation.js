const frameWidth = 270 / 6; // width ÷ columns 
const frameHeight = 54 / 2; // height ÷ rows
const spriteAnimation = [];
const animationState = [
    {
        name: 'runL',
        frames: 5
    },
    {
        name: 'runR',
        frames: 5
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
console.log(spriteAnimation['runR']);
