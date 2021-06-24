import { MapDrawable } from "../../Interfaces/MapDrawable";

export class Character implements MapDrawable {
    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        ctx.fillRect(x, y, w, h);
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    x: number = 0;
    y: number = 0;
}