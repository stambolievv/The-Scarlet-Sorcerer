import { GAME } from '../properties.js';

const decimalPlaces = 2;
const updateEachSecond = 1;
const decimalPlacesRatio = Math.pow(10, decimalPlaces);
let timeMeasurements = [];
let elapsed = 0;
let fps = 0;
let ms = 0;

export default function tick(ctx, deltaTime) {
  elapsed += deltaTime;
  timeMeasurements.push(elapsed);

  const msPassed = timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0];

  if (msPassed >= updateEachSecond * 1000) {
    fps = Math.round(timeMeasurements.length / msPassed * 1000 * decimalPlacesRatio) / decimalPlacesRatio;
    ms = Math.round(1000 / fps * decimalPlacesRatio) / decimalPlacesRatio;
    timeMeasurements = [];
  }

  if (GAME.showFps) {
    ctx.font = '30px Vanderick';
    ctx.fillStyle = 'CornflowerBlue';
    ctx.fillText('FPS: ' + fps, GAME.WIDTH * 0.9, GAME.HEIGHT * 0.18);
    ctx.fillText(' MS: ' + ms, GAME.WIDTH * 0.9, GAME.HEIGHT * 0.22);
  }
};