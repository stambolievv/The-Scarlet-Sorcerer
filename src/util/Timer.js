export default class createTimer {
  constructor(raw = false) {
    this.output = 0;
    this._lastTime = performance.now();
    this._elapsed = 0;
    this._raw = raw;
    this._active = true;
  }

  set active(boolean) {
    this._active = boolean;
  }

  start() {
    if (!this._active) { return this._lastTime = performance.now(); }

    const delta = performance.now() - this._lastTime;
    this._lastTime = performance.now();
    this._elapsed += delta;

    const total = this._elapsed / 1000;
    const seconds = total % 60;
    const minutes = (total / 60);// % 60;
    // const hours = total / 3600;

    if (!this._raw) {
      this.output = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    } else {
      this.output = Math.round(seconds);
    }
  }

  reset() {
    this.output = 0;
    this._lastTime = performance.now();
    this._elapsed = 0;
  }

  formatTime(value) {
    return ('0' + Math.floor(value)).slice(-2);
  }
}