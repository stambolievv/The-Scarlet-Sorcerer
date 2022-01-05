const decimalPlaces = 2;
const updateEachSecond = 1;
const decimalPlacesRatio = Math.pow(10, decimalPlaces);
let timeMeasurements = [];
let fps = 0;
let ms = 0;

export function tick(ctx, elapsed) {
  timeMeasurements.push(elapsed);

  const msPassed = timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0];

  if (msPassed >= updateEachSecond * 1000) {
    fps = Math.round(timeMeasurements.length / msPassed * 1000 * decimalPlacesRatio) / decimalPlacesRatio;
    ms = Math.round(1000 / fps * decimalPlacesRatio) / decimalPlacesRatio;
    timeMeasurements = [];
  }

  if (ctx.DEBUG) {
    ctx.textAlign = 'right';
    ctx.font = 'bold 24px Helvetica';
    ctx.fillStyle = 'lime';
    ctx.fillText(fps + '  :FPS', ctx.canvas.width * 0.95, ctx.canvas.height * 0.17);
    ctx.fillText(ms + '  :MS', ctx.canvas.width * 0.95, ctx.canvas.height * 0.2);
  }
};