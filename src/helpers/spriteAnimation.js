// Declare sprite sheet width and height.
const frameWidth = 50; // height ÷ rows
const frameHeight = 50; // width ÷ columns 

// buffer array 
const spriteAnimation = [];

// Manually add each animation name and frames length.
// The name should be something conventional.
const animationState = [
    { name: 'blade', frames: 3 },
];

// For each object in "animationState" array
// make easy to use another object with
// the name of the animation and location array 
// with each frame "x" and "y" coordinates
// e.g. 'name': { 'loc': [{ 'x': 0, 'y': 0 }, { 'x': 1, 'y': 1 }] }
animationState.forEach((state, row) => {
    const frames = { loc: [] };

    for (let col = 0; col < state.frames; col++) {
        const positionX = col * frameWidth;
        const positionY = row * frameHeight;
        frames.loc.push({ x: positionX, y: positionY });
    }

    spriteAnimation[state.name] = frames;
});

// Make it prettier so we can directly copy and paste it
let output = '';

for (const iterator in spriteAnimation) {
    output += `'${iterator}': ${JSON.stringify(spriteAnimation[iterator])},\n`;
}

// The result is used in "asset-pack.js" as a tileset map.
console.log(output.split('"').join("'"));