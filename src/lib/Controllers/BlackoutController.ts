import { Drawable } from "../Interfaces/Drawable";
import { VisualOffset } from "../Interfaces/VisualOffset";

export class BlackoutController implements VisualOffset, Drawable {
    hasActiveEvent: boolean = false;
    setVisualOffsetX(x: number, ts: number): void {
        throw new Error("Method not implemented.");
    }
    setVisualOffsetY(y: number, ts: number): void {
        throw new Error("Method not implemented.");
    }
    getVisualOffsetX(): number {
        throw new Error("Method not implemented.");
    }
    getVisualOffsetY(): number {
        throw new Error("Method not implemented.");
    }
    finalizeX(pos: boolean, amount: number): void {
        throw new Error("Method not implemented.");
    }
    finalizeY(pos: boolean, amount: number): void {
        throw new Error("Method not implemented.");
    }
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        throw new Error("Method not implemented.");
    }

}