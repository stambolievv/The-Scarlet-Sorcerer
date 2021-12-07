import { ctx } from '../../app.js';

export default class Perk {
    constructor(position, type) {
        this._mapPosition = [
            { x: 0.40, y: 0.13 },
            { x: 0.20, y: 0.38 },
            { x: 0.85, y: 0.38 },
            { x: 0.48, y: 0.51 },
            { x: 0.08, y: 0.66 },
            { x: 0.71, y: 0.62 },
        ];
        this._variety = [
            { name: 'BS', text: 'Bonus Heart +1', color: '#ff471a' },
            { name: 'JB', text: 'Jump Boost Increase', color: '#66ccff' },
            { name: 'MS', text: 'Movement Speed Increase', color: '#aaff80' },
            { name: 'FR', text: 'FireRate Increase', color: '#ffcc00' },
        ];

        this.pos = { x: this._mapPosition[position].x * ctx.canvas.width, y: this._mapPosition[position].y * ctx.canvas.height };
        this.dim = { w: 50, h: 50 };
        this.type = this._variety[type];
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.type.color;
        ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        ctx.closePath();
        ctx.fill();
    }
}