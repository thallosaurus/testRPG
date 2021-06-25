import { MapDrawable } from "../Interfaces/MapDrawable";
import { MapUtils } from "../Utilities";
import { GameMap } from "./GameMap";

export class SimpleTile implements MapDrawable {
    private id: number;
    constructor(t: number) {
        this.id = t - 1;
    }

    get spriteId() {
        return this.id;
    }
    
    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        // throw new Error("Method not implemented.");
        if (this.id != 0) {
            // if (GameMap.getResource()) {
            let coords = MapUtils.getXY(this.id, 30, 30);
            ctx.drawImage(
                GameMap.getResource()!,
                coords.x * 32,
                coords.y * 32,
                32,
                32,
                x,
                y,
                w,
                h
            );
            // }
        }
    }

    drawDbg(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        // throw new Error("Method not implemented.");
        if (this.id === 0) return;
        ctx.strokeStyle = MapUtils.indexToColor(this.id);
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = MapUtils.indexToColor(this.id);
        // ctx.font = "16px Arial";
        // ctx.fillText(this.id + "", x + 16, y + 16, w);
        ctx.stroke();
    }
}