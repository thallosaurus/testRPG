export interface Drawable {
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void;
    redrawDbg?(ctx: CanvasRenderingContext2D, timestamp: number): void;
    /*     textureUrl: string;
        texture: HTMLImageElement; */
}