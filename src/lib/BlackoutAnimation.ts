import Canvas, { Drawable } from "./CanvasController.js";

export class BlackoutAnimation implements Drawable {
    static alpha: number = 100;
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        // throw new Error("Method not implemented.");
        ctx.fillStyle = "rgba(0, 0, 0, " + BlackoutAnimation.alpha / 100 + ")";
        ctx.fillRect(0, 0, Canvas.width, Canvas.height);
    }
}