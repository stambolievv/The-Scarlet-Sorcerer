// This data comes for third party app.
// In this case "Tiled".
// So it needs some modification to work in our game.
const data = [5, 2, 3, 4, 5, 6, 7, 22, 9, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 7, 22, 9, 6, 5, 3, 5, 19, 20, 21, 22, 23, 24, 25, 175, 27, 28, 29, 30, 22, 20, 20, 22, 21, 20, 23, 24, 25, 175, 27, 28, 29, 8, 31, 37, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 211, 0, 0, 0, 0, 0, 0, 0, 48, 49, 55, 194, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 173, 0, 0, 0, 0, 0, 0, 0, 0, 67, 55, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 55, 0, 0, 0, 0, 0, 0, 0, 190, 0, 0, 0, 0, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 67, 55, 0, 0, 0, 0, 0, 0, 0, 145, 146, 146, 146, 146, 146, 147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 67, 55, 0, 0, 0, 0, 0, 0, 0, 181, 164, 164, 164, 164, 164, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 124, 67, 55, 188, 189, 0, 0, 0, 0, 0, 175, 174, 174, 174, 174, 174, 175, 0, 0, 145, 185, 147, 0, 0, 0, 0, 0, 0, 67, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 164, 165, 0, 0, 0, 0, 0, 0, 67, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 164, 165, 0, 0, 0, 0, 0, 0, 67, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 163, 164, 165, 0, 0, 0, 0, 0, 191, 67, 73, 74, 184, 185, 186, 0, 0, 0, 0, 0, 193, 0, 0, 0, 0, 0, 0, 181, 164, 183, 195, 0, 0, 184, 185, 186, 85, 91, 92, 92, 92, 93, 94, 92, 93, 111, 92, 92, 92, 92, 92, 92, 112, 94, 92, 93, 94, 92, 92, 92, 92, 92, 92, 103, 113, 114, 114, 114, 115, 113, 114, 115, 118, 114, 114, 114, 114, 114, 114, 119, 113, 114, 115, 113, 114, 114, 114, 114, 114, 114, 115];

let result = '';

data.forEach((id, index) => {

  if (id != 0) { id -= 1; }

  if (id == 0) { id = -1; }

  if (index % 27 == 0) { result += '\n'; }

  result += id + ', ';
});

// The result is used in "asset-pack.js" as a tileset map.
console.log(result);