export default class createTimer {
  constructor(raw = false) {
    this.output = 0;
    this.lastTime = performance.now();
    this.elapsed = 0;
    this.raw = raw;
    this.pause = false;
  }

  set isPaused(boolean) {
    this.pause = boolean;
  }

  start() {
    if (this.pause) { return this.lastTime = performance.now(); }

    const delta = performance.now() - this.lastTime;
    this.lastTime = performance.now();
    this.elapsed += delta;

    const total = this.elapsed / 1000;
    const seconds = total % 60;
    const minutes = (total / 60);// % 60;
    // const hours = total / 3600;

    if (this.raw) {
      this.output = Math.round(seconds);
    } else {
      this.output = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    }
  }

  reset() {
    this.output = 0;
    this.lastTime = performance.now();
    this.elapsed = 0;
  }

  formatTime(value) {
    return ('0' + Math.floor(value)).slice(-2);
  }
}