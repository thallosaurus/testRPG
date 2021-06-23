import { Drawable } from './CanvasController.js';

export class FPSCounter implements Drawable {
    fps: number = 0;
    times: Array<number> = [];
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        // throw new Error('Method not implemented.');

        const now = performance.now();
        while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
        }
        this.times.push(now);
        this.fps = this.times.length;
        // refreshLoop();

        ctx.fillStyle = "red";
        ctx.fillText("FPS: " + this.fps, 0, 0);

    }

}