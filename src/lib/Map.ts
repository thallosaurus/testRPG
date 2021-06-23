// import CanvasController from "./CanvasController.js";
import Canvas, { Drawable } from "./CanvasController.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { SocketConnection } from "./SocketConnection.js";
import { SimplePlayer } from "./Sprite.js";
// import Player from "./Sprite.js";

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;

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

    public mapName!: string;

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
            fetch("/assets/levels/" + filename).then(e => {
                return e.json();
            }).then((json: TiledJSONLevel) => {
                console.log(json);

                let w = new SimpleMap(json);
                w.mapName = filename;
                // console.log(o);
                // w.objects = o;
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

    get tilesAvailableY() {
        return Canvas.height / this.tileHeight;
    }

    get tilesAvailableX() {
        return Canvas.width / this.tileWidth;
    }

    //TODO Interface JSON
    constructor(config: TiledJSONLevel/* config: JSONConfig */) {
        // this.map = mapData;
        this.width = config.width;
        this.height = config.height;
        this.spriteHeight = config.tileheight * 2;
        this.spriteWidth = config.tilewidth * 2;

        this.spriteUrl = /* config.spritesheet */ "/assets/maps/test.png";
        // this.player = new Player(this);

        // this.spri
        // console.log(config);

        this.loadedTiles = new Array(this.width * this.height).fill(null);
        this.loadedObjects = new Array(this.width * this.height).fill(null);
        this.loadedTeleports = [];/* config.teleports */;

        this.map = getData("ground", config.layers) as TiledJSONLevelLayer;
        this.objects = getData("objects", config.layers) as TiledJSONLevelLayer;
        // this.teleports = getTeleports();

        console.log(config);

        // let spawnX = getDataProperties("spawnX", this.map)
        let spawnX = getPropertiesData("spawnX",
            (getData("ground", config.layers) as TiledJSONLevelLayer).properties
        );

        // let spawnX = getDataProperties("spawnX", this.map)
        let spawnY = getPropertiesData("spawnY",
            (getData("ground", config.layers) as TiledJSONLevelLayer).properties
        );

        this.posX = spawnX.value * -1;
        this.posY = spawnY.value * -1;

        let teleports = getData("teleporters", config.layers) as TiledJSONObjectLayer;
        console.log(teleports);

        //prepare teleport events:
        let tBuf = [];
        for (let o of teleports.objects) {
            let destProperty = getPropertiesData("destination", o.properties);
            let obj = {
                x: Math.floor((o.x / (this.tileWidth / 2))),
                y: Math.floor((o.y / (this.tileHeight / 2))),
                destination: (destProperty.value as string),
                id: null
            } as TeleportEvents;
            tBuf.push(obj);
        }
        this.teleports = tBuf;

        this.spawnPlayer();
        // this.parent = parent;
    }

    unloadSprites(): void {
        // throw new Error("Method not implemented.");
        URL.revokeObjectURL(this.textureUrl);
        console.log(this.textureUrl)
        // this.textureUrl = "";
    }

    async spawnPlayer() {
        let player = new SimplePlayer(this.posX * -1, this.posY * -1);
        ObjectRegistry.addToMap(player);

        // let msg = await SocketConnection.getPlayersOnMap(this.mapName);

/*         for (let m of msg) {
            console.log(m);
        } */

        // console.log(msg);
    }

    onAnimation(x: number, y: number): void {
        throw new Error("Method not implemented.");
        // this.offsetX = x;
        // this.offsetY = y;
    }

    set map(m: TiledJSONLevelLayer) {
        this.loadedTiles = m.data.map((t) => { return new SimpleTile(t) });
        // console.log(this.loadedTiles);
    }

    set objects(m: TiledJSONLevelLayer) {
        this.loadedObjects = m.data.map((t) => { return new SimpleTile(t) });
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
            return new SimpleTile(658);
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
        if (id && id !== 0) {
            this.spriteId = id - 1;
        } else {
            this.spriteId = null;
        }
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

interface TiledJSONLevel {
    compressionlevel: number;
    height: number;
    width: number;
    infinite: boolean;
    layers: Array<TiledJSONLevelLayer>;
    // nextlayerid: number;
    // nextobjectid: number;
    // orientation: string;
    // renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    // tilesets: number;
    type: string;
    version: string;
}

interface TiledJSONLevelLayer {
    data: Array<number>;
    // height: number;
    // width: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
    properties: Array<TiledJSONLevelLayerProperties>;
}

interface TiledJSONObjectLayer {
    draworder: string;
    id: number;
    name: string;
    objects: Array<TiledJSONObject>;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
}

/*
{
                                   "height": 0,
                                   "id": 10,
                                   "name": "",
                                   "properties": [
                                          {
                                                 "name": "destination",
                                                 "type": "string",
                                                 "value": "level0.json"
                                          }
                                   ],
                                   "rotation": 0,
                                   "type": "",
                                   "visible": true,
                                   "width": 0,
                                   "x": 81.3333333333333,
                                   "y": 110.666666666667
                            }
*/
interface TiledJSONObject {
    height: number;
    id: number;
    name: string;
    properties: Array<TiledJSONLevelLayerProperties>;
    rotation: number;
    type: string;
    visible: true;
    width: number;
    x: number;
    y: number;
}

interface TiledJSONLevelLayerProperties {
    /*     {
            "name": "spawnX",
            "type": "int",
            "value": 10
     }, */
    name: string;
    value: any;
}

function getData(name: string, layers: Array<TiledJSONLevelLayer>): TiledJSONLevelLayer | TiledJSONObjectLayer {
    for (let layer of layers) {
        if (layer.name === name) return layer;
    }
    throw new Error(name + " data couldn't be found");
}

function getPropertiesData(name: string, layers: Array<TiledJSONLevelLayerProperties>): TiledJSONLevelLayerProperties {
    for (let layer of layers) {
        if (layer.name === name) return layer;
    }
    throw new Error(name + " data couldn't be found");
}

/* function getTeleports(config: Array<) {

} */