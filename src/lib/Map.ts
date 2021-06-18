// import CanvasController from "./CanvasController.js";
import Canvas, { Drawable } from "./CanvasController.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { PlayerDirection, SimplePlayer } from "./Sprite.js";
// import Player from "./Sprite.js";

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;

// export interface MapDrawable {
//     drawAt(ctx: CanvasRenderingContext2D, x: number, y: number, xd: number, yd: number): void;
// }



interface Level {
    width: number;
    height: number;
    spritesheet: string;
    mapped: Array<number>;
    objects: Array<number>;
    // collision: Array<boolean>;
}

export interface ResourceLoader {
    resolveSprites(): Promise<void>;
    unloadSprites(): void;
    /*     textureUrl: string;
        texture: HTMLImageElement | null; */
}

const MAPHEIGHT = 10;
const MAPWIDTH = 10;
const TILEWIDTH = 64;
const TILEHEIGHT = 64;
/**
 *
 * @export
 * @class World
 * @implements {Drawable}
 * @implements {ResourceLoader}
 */
export interface TeleportEvents {

    x: number;
    y: number;
    destination: string;
    id: null | number;
}

export interface DrawTomap {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
}

function getArrayIndexFromInt(x: number, y: number, w: number): number {
    return y * w + x;
}

/**
 * @deprecated
 */
abstract class Builder {
    /**
     * Declares the default-state of the class
     */
    // build() : Promise<any> {};
}

export interface Animate {
    offsetX: number;
    offsetY: number;
    onAnimation(x: number, y: number): void;
}

export class SimpleMap implements ResourceLoader, Drawable, Animate {
    width: number;
    height: number;
    spriteUrl: string;
    posX: number;
    posY: number;
    offsetX: number = 0;
    offsetY: number = 0;
    // parent: CanvasController;
    textureUrl!: string;
    texture!: HTMLImageElement;

    private spriteWidth: number;
    private spriteHeight: number;
    loadedObjects: Array<null | SimpleTile>;
    loadedTiles: Array<null | SimpleTile>;
    // teleports: any;
    loadedTeleports: Array<TeleportEvents>;

    get x() {
        return this.posX;
    }

    get y() {
        return this.posY;
    }

    get visualOffsetX() {
        // console.log(this.posX + (this.offsetX * this.spriteWidth));
        return (this.offsetX * this.spriteWidth);
    }

    get visualOffsetY() {
        return (this.offsetY * this.spriteHeight);
    }

    get middleX() {
        return Math.floor(Canvas.width / this.spriteWidth / 2) * this.spriteWidth
    }
    get middleY() { return Math.floor(Canvas.height / this.spriteHeight / 2) * this.spriteHeight; }


    static build(filename: string): Promise<SimpleMap> {
        return new Promise<SimpleMap>((res, rej) => {
            /*let d = [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 0, 8, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 3, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 5, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 4, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 5
            ];*/

            fetch("/assets/levels/" + filename).then(e => {
                return e.json();
            }).then(json => {
                console.log(json);

                let w = new SimpleMap(json);
                w.map = json.mapped; //.map((e: any) => new SimpleTile(e));
                w.objects = json.objects;
                // w.map_ = d_final;
                // w.addLayer(d_final);

                // let o = new World(json.width, json.height, json.spritesheet, json.spawnX, json.spawnY, parent);
                // let o_final = json.objects.map((e: any) => new Tile(e, w));
                // w.addLayer(o_final);
                // w.addTeleports(json.teleports);
                res(w);
            });
        });
    }

    setOffset(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;
    }

    get tileWidth() {
        return this.spriteWidth;
    }

    get tileHeight() {
        return this.spriteHeight;
    }

    /*
    public getCanvasWidthTilesAvailable() {
        return Math.floor(Canvas.canvas.width / 64);
    }
    */
    get tilesAvailableY() {
        return Canvas.height / this.tileHeight;
    }

    get tilesAvailableX() {
        return Canvas.width / this.tileWidth;
    }

    //TODO Interface JSON
    constructor(config: JSONConfig) {
        // this.map = mapData;
        this.width = config.width;
        this.height = config.height;
        this.spriteHeight = 64;
        this.spriteWidth = 64;

        this.spriteUrl = config.spritesheet;
        // this.player = new Player(this);
        this.posX = config.spawnX * -1;
        this.posY = config.spawnY * -1;

        // this.spri
        // console.log(config);

        this.loadedTiles = new Array(this.width * this.height).fill(null);
        this.loadedObjects = new Array(this.width * this.height).fill(null);
        this.loadedTeleports = config.teleports;
        this.spawnPlayer();
        // this.parent = parent;
    }

    unloadSprites(): void {
        // throw new Error("Method not implemented.");
        URL.revokeObjectURL(this.textureUrl);
        console.log(this.textureUrl)
        // this.textureUrl = "";
    }

    spawnPlayer() {
        let player = new SimplePlayer(this.posX * -1, this.posY * -1);
        ObjectRegistry.addToMap(player);
    }

    onAnimation(x: number, y: number): void {
        throw new Error("Method not implemented.");
        // this.offsetX = x;
        // this.offsetY = y;
    }

    set map(m: Array<null | number>) {
        this.loadedTiles = m.map((t) => { return new SimpleTile(t) });
        // console.log(this.loadedTiles);
    }

    set objects(m: Array<null | number>) {
        this.loadedObjects = m.map((t) => { return new SimpleTile(t) });
        // console.log(this.loadedObjects);
    }

    set teleports(t: Array<TeleportEvents>) {
        t.forEach((e) => {
            e.id = this.loadedTeleports.length;
            this.loadedTeleports.push(e);
        });
    }

    resolveSprites(): Promise<void> {
        return new Promise((res, rej) => {
            fetch(this.spriteUrl).then(e => {
                return e.blob();
            }).then((blob) => {
                let img = new Image();
                this.textureUrl = URL.createObjectURL(blob);
                img.src = this.textureUrl;
                this.texture = img;
                res();
                // res(blob);
            });
        });
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        // let middleX = Math.floor(Canvas.width / this.spriteWidth / 2); // - this.x;
        // let middleY = Math.floor(Canvas.height / this.spriteHeight / 2); // - this.y;

        for (let y = this.y; y < this.tilesAvailableY + 2; y++) {
            for (let x = this.x; x < this.tilesAvailableX + 2; x++) {
                // [
                let d = this.getMapDataXY(x - this.x, y - this.y);
                this.drawToMap(ctx, d, x, y, timestamp);
            }
        }

        for (let y = this.y; y < this.tilesAvailableY + 2; y++) {
            for (let x = this.x; x < this.tilesAvailableX + 2; x++) {
                this.drawToMap(ctx, this.getTeleportsXYTile(x - this.x, y - this.y), x, y, timestamp);
                this.drawToMap(ctx, this.getObjectsXY(x - this.x, y - this.y), x, y, timestamp);
                let npc = ObjectRegistry.getNPCinXY(x - this.x, y - this.y)
                this.drawToMap(ctx, npc, x, y, timestamp);
            }
        }
        ctx.fillStyle = "red";
        ObjectRegistry.DEBUG && ctx.fillRect(this.middleX, this.middleY, this.tileWidth, this.tileHeight);

    }

    private drawToMap(ctx: CanvasRenderingContext2D, object: MapDrawable | null, x: number, y: number, timestamp: number) {
        // debugger;
        object?.drawAt(
            ctx,
            timestamp,
            (x * this.tileWidth) + this.visualOffsetX + this.middleX,
            (y * this.tileHeight) + this.visualOffsetY + this.middleY,
            this.tileWidth,
            this.tileHeight);

        ObjectRegistry.DEBUG
            && object?.drawDbg?.(
                ctx,
                timestamp,
                (x * this.tileWidth) + this.visualOffsetX + this.middleX,
                (y * this.tileHeight) + this.visualOffsetY + this.middleY,
                this.tileWidth,
                this.tileHeight);

    }

    public getAreaObj(v: Square) {
        /*         let a = 
                for (let y = v.y; y < v.h + v.y; y++) {
                    for (let x = v.x; x < v.w + v.x; x++) {
                        if (y < 0 || x < 0) 
                    }
                } */
        throw new Error("Not implemented");
    }

    public getArea(x_: number, y_: number, width: number, height: number): Array<SimpleTile | null> {
        let buf = Array<SimpleTile | null>();
        for (let y = y_; y < height + y_; y++) {
            for (let x = x_; x < width + x_; x++) {
                let tile = this.getMapDataXY(x, y);
                buf.push(tile);
            }
        }

        // debugger;

        return buf;
    }

    public getMapDataXY(x: number, y: number): SimpleTile | null {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;

        let index = SimpleMap.getI(x, y, this.width);

        let data = this.loadedTiles[index];
        if (data === undefined) return null;
        return data;
    }

    private getTeleports() {
        return this.loadedTeleports;
    }

    public getTeleportsXY(x: number, y: number): TeleportEvents | null {
        for (let n of this.getTeleports()) {
            //   console.log(n);
            if (n.x === x && n.y === y) {
                // console.log(n);
                return n;
            }
        }

        return null;
    }

    public getTeleportsXYTile(x: number, y: number): MapDrawable | null {
        if (this.getTeleportsXY(x, y) !== null) {
            return new SimpleTile(657);
        }

        return null;
    }

    private getObjectsXY(x: number, y: number) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;

        let index = SimpleMap.getI(x, y, this.width);

        let data = this.loadedObjects[index];
        if (data === undefined) return null;
        return data;
    }

    public getSpritesheet() {
        return this.texture;
    }

    static getXY(i: number, w: number, h: number): Vector2D {
        let x = i % w;
        let y = Math.floor(i / h);
        return { x: x, y: y } as Vector2D;
    }

    static getI(x: number, y: number, w: number): number {
        // return getArrayIndexFromInt(x, y, x);
        return (y * w) + x;
    }

    public moveUp() {
        this.posY++;
    }

    public moveDown() {
        this.posY--;
    }

    public moveLeft() {
        this.posX++;
    }

    public moveRight() {
        this.posX--;
    }
}

interface Vector2D {
    x: number;
    y: number
}

interface Square extends Vector2D {
    w: number;
    h: number;
}

export interface MapDrawable {
    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void;
    draw?(ctx: CanvasRenderingContext2D, timestamp: number): void;
    drawDbg?(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void;
}

export interface MapObject extends MapDrawable {
    id: number;
    x: number;
    y: number;
}

/* abstract class MapObjectClass {
    id: string | null = null;
    generateId() {
        this.id = Math.random() * 100;
    }
} */

export class SimpleTile implements MapDrawable {
    tileWidthSprite: number = 32;
    tileHeightSprite: number = 32;
    spriteId: number | null = null;
    // spriteId: number | null;
    constructor(id: number | null) {
        this.spriteId = id;
        // console.trace(id);
    }

    get id() {
        return this.spriteId;
    }

    drawAt(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number): void {
        let o = ObjectRegistry.world.getSpritesheet();
        if (this.spriteId !== null && this.hasImageLoaded(o)) {
            // console.log("Sprite ID:", this.spriteId, "Image has loaded:", this.hasImageLoaded(o))

            let xy = SimpleMap.getXY(this.spriteId /* ??????????????????????? HUH WTF*/, 30, 30);
            ctx.drawImage(
                o,
                xy.x * this.tileWidthSprite,
                xy.y * this.tileHeightSprite,
                this.tileWidthSprite,
                this.tileHeightSprite,
                x, y, w, h);
        }

    }

    drawDbg(ctx: CanvasRenderingContext2D, timestamp: number, x: number, y: number, w: number, h: number) {
        // console.log(x, y, w, h);
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();

        // ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(`(${x / this.tileWidthSprite / 2}/${y / this.tileHeightSprite / 2})`, x, y + 18, w);
        // ctx.stroke();
    }

    private hasImageLoaded(img: any): img is HTMLImageElement {
        return img !== null && img instanceof HTMLImageElement;
    }
}

interface JSONConfig {
    width: number;
    height: number;
    spritesheet: string;
    spawnX: number;
    spawnY: number;
    mapped: Array<number>;
    objects: Array<number | null>;
    teleports: Array<TeleportEvents>;

    /*"teleports": [
        {
            "x": 1,
            "y": 1,
            "destination": "level2.json"
        }
    ]*/
}