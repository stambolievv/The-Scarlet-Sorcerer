import { GAME } from '../properties.js';

const decimalPlaces = 2;
const updateEachSecond = 1;
const decimalPlacesRatio = Math.pow(10, decimalPlaces);
let timeMeasurements = [];
let fps = 0;
let ms = 0;

export default function tick(ctx, elapsed) {
  timeMeasurements.push(elapsed);

  const msPassed = timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0];

  if (msPassed >= updateEachSecond * 1000) {
    fps = Math.round(timeMeasurements.length / msPassed * 1000 * decimalPlacesRatio) / decimalPlacesRatio;
    ms = Math.round(1000 / fps * decimalPlacesRatio) / decimalPlacesRatio;
    timeMeasurements = [];
  }

  if (ctx.DEBUG || GAME.showFps) {
    // global values
    ctx.font = 'bold 22px rubber';
    ctx.fillStyle = 'CornflowerBlue';
    ctx.fillText('FPS: ' + fps, ctx.canvas.width * 0.9, ctx.canvas.height * 0.17);
    ctx.fillText(' MS: ' + ms, ctx.canvas.width * 0.9, ctx.canvas.height * 0.2);
    ctx.lineWidth = 2;
  }
};