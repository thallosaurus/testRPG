import { AnimationController } from "./AnimationController.js";
import { Drawable } from "./CanvasController.js";
import { ResourceLoader, SimpleTile, DrawTomap, MapObject, TeleportEvents } from "./Map.js";
import { ObjectRegistry } from "./ObjectRegistry.js";


export enum PlayerDirection {
    DOWN,
    LEFT,
    RIGHT,
    UP
}

// const socket;
export class PlayerEntity implements MapObject {
    static textureUrl: string;
    static texture: HTMLImageElement | null = null;

    x_: number;
    y_: number;
    // id!: number;
    offsetX: number = 0;
    offsetY: number = 0;
    walkingProgress: number = 0;
    movementBlocked: boolean = true;

    get x() {
        return this.x_;
    }

    get y() {
        return this.y_;
    }

    get id(): number {
        return ObjectRegistry.mapObjects.indexOf(this);
    }

    private direction: PlayerDirection = PlayerDirection.DOWN;

    get width() {
        return 64;
    }

    get height() {
        return 64;
    }

    get visualOffsetX() {
        // console.log(this.posX + (this.offsetX * this.spriteWidth));
        return (this.offsetX * this.width);
    }

    get visualOffsetY() {
        return (this.offsetY * this.height);
    }

    progressWalking() {
        let p = this.walkingProgress + 1;
        // console.log(this.walkingProgress);
        this.walkingProgress = p % 4;
    }

    standStill() {
        this.walkingProgress = 0;
    }

    constructor(x: number, y: number) {
        // this.id = Math.random() * 100;
        this.x_ = x;
        this.y_ = y;
    }

    setOffset(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;
    }

    static resolveSprites(): Promise<void> {
        console.log("Resolving Player Sprites");
        return new Promise((res, rej) => {
            if (PlayerEntity.texture !== null) res();
            fetch("/assets/sprites/player.png").then(e => {
                return e.blob();
            }).then((blob) => {
                let img = new Image();
                PlayerEntity.textureUrl = URL.createObjectURL(blob);
                img.src = PlayerEntity.textureUrl;
                PlayerEntity.texture = img;
                res();
                // res(blob);
            });
        });
    }

    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        // throw new Error("Method not implemented.")
        if (PlayerEntity.texture !== null) {
            ctx.drawImage(
                PlayerEntity.texture,
                this.walkingProgress * this.width,
                this.direction * this.height,
                this.width,
                this.height,
                x + this.visualOffsetX,
                y + this.visualOffsetY,
                this.width,
                this.height);
        }
    }

    draw(ctx: CanvasRenderingContext2D, timestamp: number) {

    }

    drawDbg(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        ctx.fillStyle = "green";
        ctx.fillRect(x * w, y * h, w, h);
    }

    lookTo(dir: PlayerDirection) {
        this.direction = dir;
    }

    public remove() {
        ObjectRegistry.removeNPC(this.id);
    }
}

export class SimplePlayer extends PlayerEntity {

    private check(o: Array<SimpleTile | MapObject | TeleportEvents | null>) {

        // if (this.movementBlocked) return false;
        if (o[0] === null || o[0]?.id === null) return false;
        if (o[1] !== null) return false;
        if (o[2] !== null) return true;

        return true;
    }

    private teleportIfNeeded() {
        let tp = ObjectRegistry.world.getTeleportsXY(this.x, this.y);
        if (tp !== null) {
            ObjectRegistry.goToLevel(tp!.destination);
        }
    }

    public async moveUp() {
        return new Promise<void>(async (res, rej) => {
            if (this.movementBlocked) return;
            !AnimationController.isMoving && this.lookTo(PlayerDirection.UP);
            let o = ObjectRegistry.getXYAllLayers(this.x, this.y - 1);
            this.check(o) &&
                await AnimationController.mapMoveUp();
                res();
            this.teleportIfNeeded();
        });
    }

    public async moveDown() {
        if (this.movementBlocked) return;
        !AnimationController.isMoving && this.lookTo(PlayerDirection.DOWN);
        let o = ObjectRegistry.getXYAllLayers(this.x, this.y + 1);
        // console.log(o);
        this.check(o) &&
            await AnimationController.mapMoveDown();
        this.teleportIfNeeded();
    }

    public async moveLeft() {
        if (this.movementBlocked) return;
        !AnimationController.isMoving && this.lookTo(PlayerDirection.LEFT);
        let o = ObjectRegistry.getXYAllLayers(this.x - 1, this.y);
        // console.log(o);
        this.check(o) &&
            await AnimationController.mapMoveLeft();
        this.teleportIfNeeded();
    }

    public async moveRight() {
        if (this.movementBlocked) return;
        !AnimationController.isMoving && this.lookTo(PlayerDirection.RIGHT);
        let o = ObjectRegistry.getXYAllLayers(this.x + 1, this.y);
        // console.log(o);
        this.check(o) &&
            await AnimationController.mapMoveRight();
        this.teleportIfNeeded();
    }
}