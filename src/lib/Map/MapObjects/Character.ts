import { Socket } from "dgram";
import { MultiplayerClient } from "../../Client/SocketClient";
import { AnimationController } from "../../Controllers/AnimationController";
import { AudioController } from "../../Controllers/AudioController";
import { MapDrawable } from "../../Interfaces/MapDrawable";
import { ImageLoader } from "../../Interfaces/ResourceLoader";
import { PlayerX } from "../../Interfaces/ServerEvents";
import { UpdatePending } from "../../Interfaces/UpdatePending";
import { VisualOffset } from "../../Interfaces/VisualOffset";
import { MapUtils } from "../../Utilities";

export class Character implements MapDrawable, ImageLoader, VisualOffset, UpdatePending {
    static imageUrl: string | null = null;
    static image: HTMLImageElement | null = null;

    static dingSound: ArrayBuffer;

    public x: number;
    public y: number;
    public id: string;

    updatePending: boolean = false;

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
        this.progress = Math.floor(ts / 125) % 4;
    }

    public lookAt(direction: PlayerDirection) {
        this.direction = direction;
    }

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;

        console.log("Set " + id + " to ", x, y);
    }

    //UNUSED
    hasActiveEvent: boolean = false;

    visualXOffset: number = 0;
    visualYOffset: number = 0;
    setVisualOffsetX(x: number, ts: number): void {
        this.setAnimationProgress(ts);
        this.visualXOffset = x;
    }
    setVisualOffsetY(y: number, ts: number): void {
        this.setAnimationProgress(ts);
        this.visualYOffset = y;
    }
    getVisualOffsetX(): number {
        return this.visualXOffset;
    }
    getVisualOffsetY(): number {
        return this.visualYOffset;
    }
    finalizeX(pos: boolean, amount: number): void {

    }
    finalizeY(pos: boolean, amount: number): void {

    }

    setX(x: number) {
        this.x = x;
    }
    setY(y: number) {
        this.y = y;
    }

    static playDingSound() {
        AudioController.playSound(Character.dingSound);
    }

    resolveResource(): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (Character.image !== null) res();
            fetch("/assets/sprites/player.png").then(e => {
                return e.blob();
            }).then(blob => {
                Character.imageUrl = URL.createObjectURL(blob);
                Character.image = new Image();
                Character.image.src = Character.imageUrl;
            });

            fetch("/assets/sounds/ding.mp3").then(e => {
                return e.arrayBuffer()
            }).then(e => {
                Character.dingSound = e;
                res();
            });
        })
    }
    unloadResource(): void {

    }
}


export enum PlayerDirection {
    DOWN,
    LEFT,
    RIGHT,
    UP
}