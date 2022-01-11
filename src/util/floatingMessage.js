import { GAME } from '../properties.js';
import { textMessages } from '../constants.js';
import { relativePosition } from '../mechanics.js';

class FloatingMessage {
  constructor(text, position, fixed, size, color) {
    this.text = text;
    this.pos = { x: position.x, y: position.y };
    this.fixed = fixed;
    this.size = size;
    this.color = color;
    this.lifeSpan = 0;
    this.opacity = 1;
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;

    ctx.font = this.size + 'px rubber';
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    this.text.split('\n').forEach((t, i) => ctx.fillText(t, this.pos.x, this.pos.y + (i * this.size)));

    ctx.globalAlpha = 1;
  }

  update() {
    this.pos.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.01) { this.opacity -= 0.005; }
  }
}

function messageCreate(text, priority = 0, size = 18, color = 'white', position = { x: 0.5, y: 0.3 }, fixed = true) {
  const spawnPoint = relativePosition(position.x, position.y);
  textMessages.unshift({ priority, text: new FloatingMessage(text, spawnPoint, fixed, size, color) });
}

function floatingMessages(ctx) {
  textMessages
    .sort((a, b) => b.priority - a.priority)
    .forEach(({ text }, i) => {
      if (text.fixed) { text.pos.y = GAME.HEIGHT * 0.3 - i * 30; }
      text.draw(ctx);
      text.update();
      if (text.lifeSpan > 200) { textMessages.splice(i, 1); }
    });

  //text on display
  GAME.TIMER.start();
  ctx.font = '22px rubber';
  ctx.fillStyle = 'white';
  ctx.fillText('Timer: ' + GAME.TIMER.output, GAME.WIDTH * 0.5, GAME.HEIGHT * 0.040);
  ctx.fillText('Score: ' + GAME.SCORE, GAME.WIDTH * 0.5, GAME.HEIGHT * 0.075);
  ctx.fillText('High Score: ' + GAME.HIGHSCORE, GAME.WIDTH * 0.5, GAME.HEIGHT * 0.11);
}

export {
  messageCreate,
  floatingMessages,
};
