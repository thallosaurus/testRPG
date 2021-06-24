import { AnimationController } from "../../Controllers/AnimationController.js";
import { MapDrawable } from "../../Interfaces/MapDrawable.js";
import { ImageLoader } from "../../Interfaces/ResourceLoader.js";
import { VisualOffset } from "../../Interfaces/VisualOffset.js";
import { MapUtils } from "../../Utilities.js";

export class Character implements MapDrawable, ImageLoader, VisualOffset {
    static imageUrl:string | null = null;
    static image:HTMLImageElement | null = null;

    progress: number = 0;
    direction: PlayerDirection = PlayerDirection.DOWN;
    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        ctx.fillStyle = MapUtils.indexToColor(this.progress);
        if (Character.image === null) return;
        ctx.drawImage(Character.image,
            this.progress * 64,
            this.direction * 64,
            64,
            64,
            x + this.getVisualOffsetX(),
            y + this.getVisualOffsetY(),
            w,
            h
            );
    }

    public setAnimationProgress(ts: number) {
        this.progress = Math.floor(ts / 250) % 4;
    }

    public lookAt(direction: PlayerDirection) {
        this.direction = direction;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    hasActiveEvent: boolean = false;
    visualXOffset: number = 0;
    visualYOffset: number = 0;
    setVisualOffsetX(x: number, ts: number): void {
        this.setAnimationProgress(ts);
        this.visualXOffset = x;
        // throw new Error("Method not implemented.");
    }
    setVisualOffsetY(y: number, ts: number): void {
        this.setAnimationProgress(ts);
        // throw new Error("Method not implemented.");
        this.visualYOffset = y;
    }
    getVisualOffsetX(): number {
        // throw new Error("Method not implemented.");
        return this.visualXOffset;
    }
    getVisualOffsetY(): number {
        // throw new Error("Method not implemented.");
        return this.visualYOffset;
    }
    finalizeX(pos: boolean, amount: number): void {
        // throw new Error("Method not implemented.");
        this.visualXOffset = 0;
        this.x += (pos ? 1 : -1) * amount;
    }
    finalizeY(pos: boolean, amount: number): void {
        // throw new Error("Method not implemented.");
        this.visualYOffset = 0;
        this.y += (pos ? 1 : -1) * amount;
    }

    moveUp(distance: number) {
        this.lookAt(PlayerDirection.UP);
        AnimationController.scheduleMapMoveAnimation(this, "y", false, distance);
    }
    
    moveDown(distance: number) {
        this.lookAt(PlayerDirection.DOWN);
        AnimationController.scheduleMapMoveAnimation(this, "y", true, distance);
    }
    
    moveLeft(distance: number) {
        this.lookAt(PlayerDirection.LEFT);
        AnimationController.scheduleMapMoveAnimation(this, "x", false, distance);
    }
    
    moveRight(distance: number) {
        this.lookAt(PlayerDirection.RIGHT);
        AnimationController.scheduleMapMoveAnimation(this, "x", true, distance);
    }

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return new Promise<void>((res, rej) => {
            if (Character.image !== null) res();
            fetch("/assets/sprites/player.png").then(e => {
                return e.blob();
            }).then(blob => {
                Character.imageUrl = URL.createObjectURL(blob);
                Character.image = new Image();
                Character.image.src = Character.imageUrl;
                res();
            });
        })
    }
    unloadResource(): void {
        // throw new Error("Method not implemented.");
    }
    x: number = 0;
    y: number = 0;
}


export enum PlayerDirection {
  DOWN,
  LEFT,
  RIGHT,
  UP
}