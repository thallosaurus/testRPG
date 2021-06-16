
/**
 * @deprecated
 */
/* export namespace Sprites {



    function fileHasLoaded(elem: HTMLImageElement | null): elem is HTMLImageElement {
        return elem instanceof HTMLImageElement;
    }
    
    export class SpriteMap extends RequestedFile {
        private readonly filename: String;
        public readonly tileWidth: number;
        public readonly tileHeight: number;
        private spriteMap!: HTMLImageElement;
        private spriteMapUrl!: string | null;

        static readonly NORMAL_SPEED = 250;
        static readonly FAST_SPEED = 100;

        constructor(filename: String, config: SpriteMapConfig = {
            tileHeight: 32,
            tileWidth: 32
        }) {
            super();
            this.filename = filename;
            this.tileHeight = config.tileHeight;
            this.tileWidth = config.tileWidth;
        }

        public getFileName() {
            return this.filename;
        }

        public loadSprite(): Promise<void> {
            return new Promise(async (res, rej) => {
                let sm: Blob = (await RequestedFile.load("assets/sprites/" + this.filename));
                this.spriteMapUrl = URL.createObjectURL(sm);

                this.spriteMap = new Image();
                this.spriteMap.src = this.spriteMapUrl;
                res();
            });
        }
        
        public unloadSprite() {
            if (this.spriteMapUrl === null) {
                throw new Error("Can not unload sprite that isn't loaded");
            }

            URL.revokeObjectURL(this.spriteMapUrl);
            this.spriteMapUrl = null;
        }

        public getImage(): HTMLImageElement {
            return this.spriteMap;
        }
    }

    export class OneTwoThree extends SpriteMap implements Drawable {
        private current: number;
        constructor(offset: number = 0) {
            super("onetwothree.png");
            this.current = offset % 4;
        }

        onDraw(ctx: CanvasRenderingContext2D): void {
            // throw new Error("Method not implemented.");
            if (fileHasLoaded(this.getImage())) {
                // console.log(this.getImage());
                ctx.drawImage(
                    this.getImage(),
                    this.current * this.tileWidth,
                    0,
                    this.tileWidth,
                    this.tileHeight,
                    0,
                    0,
                    this.tileWidth,
                    this.tileHeight
                );
            } else console.warn(this.getFileName() + " Is not loaded yet");
        }

        public flip(num: number) {
            this.current = num % 4;
        }

        public increase() {
            let g = this.current + 1;
            this.current = g % 4;
            // console.log(this.current);
        }
    }

    export namespace Player {
        export enum Direction {
            DOWN,
            LEFT,
            RIGHT,
            UP
        }

        
        export class PlayerSprite extends SpriteMap implements Drawable {
            private direction: Direction;
            private current: number = 0;
            private aTimestamp: number | null = null;
            running: any;

            constructor() {
                super("player.png", {
                    tileHeight: 64,
                    tileWidth: 64
                });
                this.direction = Direction.DOWN;
            }

            onDraw(ctx: CanvasRenderingContext2D): void {
                if (fileHasLoaded(this.getImage())) {
                    
                    // console.log(current);
                    ctx.drawImage(
                        this.getImage(),
                        (this.getCurrentFrame()) * this.tileWidth,
                        this.direction * this.tileHeight,
                        this.tileWidth,
                        this.tileHeight,
                        (Controllers.CanvasController.canvas.width / 2) - (this.tileWidth / 2),
                        (Controllers.CanvasController.canvas.height / 2) - (this.tileHeight / 2),
                        this.tileWidth,
                        this.tileHeight
                    );
                }
            }

            public getCurrentFrame() {
                if (this.aTimestamp !== null) {
                    return ~~((this.rTimestamp - this.aTimestamp!) / (
                        (this.running ? SpriteMap.FAST_SPEED : SpriteMap.NORMAL_SPEED)
                    )) % 4;
                } else {
                    return 0;
                }
            }

            public setDirection(dir: Direction) {
                console.log("setting direction " + dir);
                // console.log(this.aTimestamp);
                // console.log(this.rTimestamp - this.aTimestamp!);
                this.direction = dir;
            }

            public advanceAnimation() {
                let g = this.current;
                g++;
                this.current = g % 4;
            }

            private resetAnimation() {
                this.aTimestamp = this.rTimestamp;
            }

            public disableAnimation() {
                this.aTimestamp = null;
            }

            public enableAnimation() {
                this.resetAnimation();
            }

            public isAnimating() {
                return this.aTimestamp !== null;
            }

            public startRunning() {
                // this.resetAnimation();
                this.running = true;
            }
            
            public stopRunning() {
                // this.resetAnimation();
                this.running = false;
            }

            public isRunning() {
                return this.running === true;
            }
        }
    }

    export class ClearScreen implements Drawable {
        private readonly canvas: HTMLCanvasElement;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
        }

        onDraw(ctx: CanvasRenderingContext2D): void {
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

    }

    export type SpriteMapConfig = {
        tileWidth: number;
        tileHeight: number;
    }

    export interface Drawable {
        onDraw(ctx: CanvasRenderingContext2D): void;
    }
}
*/

import { Drawable } from "./CanvasController.js";
import { ResourceLoader, World, DrawTomap, MapObject } from "./Map.js";


export enum Direction {
    DOWN,
    LEFT,
    RIGHT,
    UP
}

export default class Player implements DrawTomap, ResourceLoader, Drawable {
    private spritePath!: string;
    public spritesheet?: HTMLImageElement;

    private x_: number;
    private y_: number;

    private direction: Direction;
    private walkingState = 0;

    public lookAt(dir: Direction) {
        if (!this.parent.moving) this.direction = dir;
    }

    public incX() {
        // this.direction = Direction.RIGHT;
        this.x_++;
    }

    public decX() {
        // this.direction = Direction.LEFT;
        this.x_--;
    }

    public incY() {
        // this.direction = Direction.DOWN;
        this.y_++;
    }

    public decY() {
        // this.direction = Direction.UP;
        this.y_--;
    }

    public get x(): number {
        return this.x_;
    }

    public get y(): number {
        return this.y_;
    }

    public getOwnX(): number {
        return Math.floor((this.parent.middleX + this.parent.x) / this.parent.tilewidth) - 1;
    }

    public getOwnY(): number {
        return Math.floor((this.parent.middleY + this.parent.y) / this.parent.tileheight) - 1;
    }

    public async startAnimation(p: Promise<void>) {
        //play animation once and wait for resolve of promise
        let i = 0;
        i++
        this.walkingState = i % 4
        let g = setInterval(() => {

            i++;
            this.walkingState = i % 4;
        }, 100);

        await p;
        clearInterval(g);
        this.walkingState = 0;
    }

    /*     private x: number;
        private y: number; */
    private parent: World;

    constructor(parent: World) {
        console.log(parent);
        this.x_ = 0;
        this.y_ = 0;
        this.direction = Direction.DOWN;
        this.parent = parent;
    }
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        throw new Error("Method not implemented.");
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        /*         this.x_ = x;
                this.y_ = y; */
        if (this.spritesheet) {
            ctx.drawImage(this.spritesheet, (this.walkingState * 64), (this.direction * 64), 64, 64, x, y, w, h);
        }
    }

    resolveSprites(): Promise<void> {
        return new Promise((res, rej) => {
            let f = fetch("/assets/sprites/player.png").then(e => {
                return e.blob();
            }).then(b => {
                let img = new Image();
                this.spritePath = URL.createObjectURL(b);
                img.src = this.spritePath;
                this.spritesheet = img;
                res();
            });
        });
    }
    /*     redraw(ctx: CanvasRenderingContext2D): void {
            // throw new Error("Method not implemented.");
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, 100, 100);
    
            if (this.spritesheet) {
                // ctx.drawImage(this.spritesheet)
            }
    
        } */

}

enum PlayerDirection {
    DOWN,
    LEFT,
    RIGHT,
    UP
}
export class PlayerEntity implements MapObject {
    static textureUrl: string;
    static texture: HTMLImageElement | null = null;

    x: number;
    y: number;
    id: number;

    private direction: PlayerDirection = PlayerDirection.DOWN;

    get width() {
        return 64;
    }

    get height() {
        return 64;
    }

    constructor(x: number, y: number) {
        this.id = Math.random() * 100;
        this.x = x;
        this.y = y;
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
        let a = 0;

        if (PlayerEntity.texture !== null) {
        ctx.drawImage(
            PlayerEntity.texture,
            0,
            this.direction * this.height,
            this.width,
            this.height,
            x,
            y,
            this.width,
            this.height);
        }
    }

    draw(ctx: CanvasRenderingContext2D, timestamp: number) {
        if (PlayerEntity.texture !== null) {
            ctx.drawImage(
                PlayerEntity.texture,
                0,
                0,
                this.width,
                this.height,
                this.x * this.width,
                this.y * this.height,
                this.width,
                this.height);
            }
    }

    drawDbg(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        // ctx.strokeStyle = "green";
        // ctx.beginPath();
        // ctx.rect(x, y, w, h);
        // ctx.stroke();
        ctx.fillStyle = "green";
        ctx.fillRect(x * w, y * h, w, h);
    }

    lookTo(dir: PlayerDirection) {
        this.direction = dir;
    }

}

export class SimplePlayer extends PlayerEntity {

}