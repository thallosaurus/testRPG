export interface MapDrawable {
    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w:number, h: number): void;
    drawDbg?(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w:number, h: number): void;
}