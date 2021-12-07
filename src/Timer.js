export default class createTimer {
    constructor(active = true, rawOutput = false) {
        this.lastTime = performance.now();
        this.output = 0;
        this.elapsed = 0;
        this.active = active;
        this.rawOutput = rawOutput;
    }
    set pause(bool) {
        if (!bool && !this.active) {
            this.active = true;
            this.lastTime = performance.now();
            this.start(this.lastTime);
        } else {
            this.active = false;
        }
    }
    set raw(bool) {
        if (bool && !this.rawOutput) {
            this.rawOutput = true;
        } else {
            this.rawOutput = false;
        }
    }
    start() {
        if (this.active) {
            const delta = performance.now() - this.lastTime;
            this.elapsed += delta;
            this.lastTime = performance.now();

            const total = this.elapsed / 1000;
            const seconds = total % 60;
            const minutes = (total / 60);// % 60;
            // const hours = total / 3600;

            if (!this.rawOutput) {
                this.output = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
            } else {
                this.output = Math.round(seconds);
            }
        }
    }
    reset() {
        this.elapsed = 0;
        this.output = 0;
    }
    formatTime(value) {
        return ('0' + Math.floor(value)).slice(-2);
    }
}