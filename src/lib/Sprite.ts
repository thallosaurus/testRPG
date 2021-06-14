
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

import { Drawable } from "./CanvasController";
import MapData, { ResourceLoader } from "./Map";

export default class Player implements Drawable, ResourceLoader {
    private spritePath!: string;
    public spritesheet?: HTMLImageElement;

    /*     private x: number;
        private y: number; */
    private parent: MapData;

    constructor(parent: MapData) {
        this.parent = parent;
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
    redraw(ctx: CanvasRenderingContext2D): void {
        // throw new Error("Method not implemented.");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);

        if (this.spritesheet) {
            // ctx.drawImage(this.spritesheet)
        }

    }

}