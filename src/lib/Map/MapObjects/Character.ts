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
    static imageUrl:string | null = null;
    static image:HTMLImageElement | null = null;
    
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
    
    constructor(id: string, x:number, y:number) {
        //super("wss://localhost:")
        // client.io.on("playerx", (msg: PlayerX) => {
        //     console.log(msg);
        //     let diff = MapUtils.getDifference(this.x, this.y, msg.newX, 0);
        //     console.log(diff);

        //     //check if it is left right up or down then move there
        //     // if ()
        // });

        this.id = id;
        this.x = x;
        this.y = y;

        console.log("Set " + id + " to ", x, y);
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
        this.visualYOffset = y - 64;
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
        this.hasActiveEvent = false;
        this.x += (pos ? 1 : -1) * amount;
        // this.setX((pos ? 1 : -1) * amount);
        this.visualXOffset = 0;
        
        console.log(this.x);
        // console.log("asdfdghjkl", this.x);
    }
    finalizeY(pos: boolean, amount: number): void {
        // throw new Error("Method not implemented.");
        this.hasActiveEvent = false;
        // console.log()
        this.y += (pos ? 1 : -1) * amount;
        // this.setY((pos ? 1 : -1) * amount);
        this.visualYOffset = 0; 

        console.log(this.y);
    }

    setX(x: number) {
        this.x = x;
        // this.y = y;
    }
    setY(y: number) {
        // this.x = x;
        this.y = y;
    }
    
    moveUp(distance: number) {
        this.lookAt(PlayerDirection.UP);
        // AnimationController.scheduleMapMoveAnimation(this, "y", false, distance);
    }
    
    moveDown(distance: number) {
        this.lookAt(PlayerDirection.DOWN);
        // AnimationController.scheduleMapMoveAnimation(this, "y", true, distance);
    }
    
    moveLeft(distance: number) {
        this.lookAt(PlayerDirection.LEFT);
        // AnimationController.scheduleMapMoveAnimation(this, "x", false, distance);
    }
    
    moveRight(distance: number) {
        this.lookAt(PlayerDirection.RIGHT);
        // AnimationController.scheduleMapMoveAnimation(this, "x", true, distance);

    }

    static playDingSound() {
        //alert("ding");
        AudioController.playSound(Character.dingSound);
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
        // throw new Error("Method not implemented.");
    }
}


export enum PlayerDirection {
  DOWN,
  LEFT,
  RIGHT,
  UP
}