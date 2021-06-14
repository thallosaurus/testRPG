import CanvasController from "./CanvasController.js";
import Canvas, { Drawable } from "./CanvasController.js";
import Player from "./Sprite.js";

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;

/**
 * @deprecated
 */
export default class MapData implements Drawable, ResourceLoader {
    readonly TILEWIDTH = 32;
    readonly TILEHEIGHT = 32;
    private zoomlevel: number = 2;

    readonly MAPWIDTH: number;
    readonly MAPHEIGHT: number;

    private mapdata!: Array<MapTile>;
    private objectdata!: Array<MapTile>;
    private ogSpriteSheet: string;

    public currentAreaX: number = 0;
    public currentAreaY: number = 0;

    private objectsRendering: boolean = true;
    // private spriteData!: /* Spritesheet */HTMLImageElement;
    public spritesheet?: HTMLImageElement;
    public spritePath!: string;

    private player: Player;

    private parent: Canvas;
    constructor(mapdata_: Level, parent: Canvas) {
        this.parent = parent;
        this.ogSpriteSheet = mapdata_.spritesheet;
        this.MAPWIDTH = mapdata_.width;
        this.MAPHEIGHT = mapdata_.height;
        this.mapdata = this.prepareMap(mapdata_.mapped);
        this.objectdata = this.prepareMap(mapdata_.objects);

        this.player = new Player(this);
        this.player.resolveSprites();
    }

    public decreaseAreaX() {
        this.currentAreaX--;
    }

    public increaseAreaX() {
        this.currentAreaX++;
    }

    public decreaseAreaY() {
        this.currentAreaY--;
    }

    public increaseAreaY() {
        this.currentAreaY++;
    }

    public setCurrentAreaX(displace: number) {
        this.currentAreaX += displace;
    }

    public setCurrentAreaY(displace: number) {
        this.currentAreaY += displace;
    }

    async resolveSprites(): Promise<void> {
        return new Promise((res, rej) => {
            let f = fetch(this.ogSpriteSheet).then(e => {
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

    redrawWorld(ctx: CanvasRenderingContext2D): void {
        // throw new Error("Method not implemented.");
        // ctx.fillRect(50, 50, 50, 50);

    }

    drawArray(arr: Array<MapTile>, ctx: CanvasRenderingContext2D) {
        let visibleArea = this.getArea(this.currentAreaX, this.currentAreaY, this.parent.getCanvasWidthTilesAvailable(), this.parent.getCanvasHeightTilesAvailable());
        for (let x = 0; x < this.MAPWIDTH; x++) {
            for (let y = 0; y < this.MAPHEIGHT; y++) {
                let tile = visibleArea[y * this.MAPWIDTH + x];
                if (tile !== null && tile !== undefined) {
                    tile.drawAt(
                        ctx,
                        this.TILEWIDTH * x,
                        this.TILEHEIGHT * y,
                        this.TILEWIDTH * this.currentAreaX,
                        this.TILEHEIGHT * this.currentAreaY);
                }
            }
        }
        /*         for (let x = 0; x < )
                    ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.rect(this.TILEWIDTH * x, this.TILEHEIGHT * y, this.TILEWIDTH, this.TILEHEIGHT);
                ctx.stroke(); */
    }

    private getArea(x: number, y: number, w: number, h: number) {
        let b = [];
        for (let iy = 0; iy < h; iy++) {
            for (let ix = 0; ix < w; ix++) {
                let offset = iy * this.MAPWIDTH + ix;
                if (ix < this.MAPWIDTH || iy < this.MAPHEIGHT && this.mapdata[offset] !== undefined) {
                    b.push(this.mapdata[offset]);
                } else {
                    b.push(null);
                }
            }
        }

        return b;
    }

    redraw(ctx: CanvasRenderingContext2D): void {
        this.drawArray(this.mapdata, ctx);
        if (this.objectsRendering) {
            this.drawArray(this.objectdata, ctx);
            // this.redrawObjects(ctx);
        }
        this.player.redraw(ctx);
    }

    private prepareMap(m: Array<number>): Array<MapTile> {
        return m.map((value: number, index: number) => {
            return new MapTile(value, this);
        });
    }

    /**
     * @deprecated
     */
    public unloadMap() {
        URL.revokeObjectURL(this.spritePath);
        this.spritePath = "";
        console.log("unloaded", this);
    }

    static async loadMap(levelfile: string, p: Canvas) {
        return new Promise<MapData>((res, rej) => {
            fetch("/assets/levels/" + levelfile)
                .then(j => {
                    return j.json();
                }).then(data => {
                    res(new MapData(data, p));
                });
        });
    }

    public toggleObjectsRendering() {
        this.objectsRendering = !this.objectsRendering;
    }
}

export interface MapDrawable {
    drawAt(ctx: CanvasRenderingContext2D, x: number, y: number, xd: number, yd: number): void;
}

class MapTile implements MapDrawable {
    private readonly offsetX: number;
    // private readonly offsetY: number;
    // private spriteUrl: string = "";
    private readonly parent: MapData;

    private readonly posX: number;
    private readonly posY: number;

    private readonly drawMe: boolean;

    get sprite(): HTMLImageElement | undefined {
        return this.parent.spritesheet;
    }

    constructor(selectedSprite: number,
        md: MapData) {

        this.drawMe = selectedSprite !== null;
        this.offsetX = selectedSprite;
        // this.offsetY = offsetY;
        this.parent = md;

        //get x coord of sprite on sheet
        let y = Math.floor(selectedSprite / TILEMAXWIDTH);
        let x = selectedSprite % TILEMAXWIDTH;
        this.posX = x;
        this.posY = y;
        console.log(x, y);
    }

    /*     public setSpriteUrl(bloburl: string) {
            this.spriteUrl = bloburl;
        }
     */
    drawAt(ctx: CanvasRenderingContext2D, x: number, y: number, xd: number, yd: number): void {
        if (this.sprite && this.drawMe) {
            /*             ctx.fillStyle = this.debugOffsetToColor(this.offsetX);
                        ctx.fillRect(this.posX * this.parent.TILEWIDTH, this.posY * this.parent.TILEHEIGHT, 32, 32); */
            ctx.drawImage(this.sprite,
                this.posX * this.parent.TILEWIDTH,
                this.posY * this.parent.TILEHEIGHT,
                this.parent.TILEWIDTH,
                this.parent.TILEHEIGHT,
                x + (this.parent.currentAreaX * this.parent.TILEWIDTH),
                y + (this.parent.currentAreaY * this.parent.TILEHEIGHT),
                this.parent.TILEHEIGHT,
                this.parent.TILEWIDTH);
        }
    }

    private debugOffsetToColor(o: number) {
        switch (o) {
            case 0:
                return "white";
            case 1:
                return "blue";
            default:
                return "black";
        }
    }
}

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
}

const MAPHEIGHT = 10;
const MAPWIDTH = 10;
const TILEWIDTH = 64;
const TILEHEIGHT = 64;
export class World implements Drawable, ResourceLoader {
    private parent: CanvasController;

    private map!: Array<number>;

    private x_: number = 0;
    private y_: number = 0;

    /*     public get x() {
            return this.parent.getCanvasHeightTilesAvailable()
        } */

    public incX() {
        this.x_++;
    }

    public decX() {
        this.x_--;
    }

    get x(): number {
        return this.x_ * TILEMAXWIDTH;
    }
    get y(): number {
        return this.y_ * TILEMAXWIDTH;
    }

    constructor(mapData: Array<number>, parent: CanvasController) {
        this.map = mapData;
        this.parent = parent;
    }

    resolveSprites(): Promise<void> {
        return new Promise((res, rej) => {
            res();
        });
    }

    static loadMap(filename: string, parent: CanvasController) {
        return new Promise<World>((res, rej) => {
            let d = [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 0, 8, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 3, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 5, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 4, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ];

            res(new World(d, parent));
        });
    }

    getAreaFromData(x: number, y: number, w: number, h: number): Array<number | null> {
        let buffer = Array<number | null>();

        console.log(x, y, w, h);

        // if (x > MAPWIDTH || y > MAPHEIGHT) return null;
        for (; y < this.parent.getCanvasHeightTilesAvailable(); y++) {
            for (x = 0; x < this.parent.getCanvasWidthTilesAvailable(); x++) {
                buffer.push(this.getMapDataXY(x, y));
            }
        }

        return buffer;

    }

    private getMapDataXY(x: number, y: number): number {
        // return this.map.getArrayIndexFromInt(x, y, MAPWIDTH, MAPHEIGHT);
        return this.map[getArrayIndexFromInt(x, y, MAPWIDTH, MAPHEIGHT)] ?? null;
    }

    redraw(ctx: CanvasRenderingContext2D): void {
        // throw new Error("Method not implemented.");
        let showBuffer = this.getAreaFromData(this.x_, this.y_, MAPWIDTH, MAPHEIGHT);
        for (let y = 0; y < this.parent.getCanvasHeightTilesAvailable(); y++) {
            for (let x = 0; x < this.parent.getCanvasWidthTilesAvailable(); x++) {
                if (x < MAPWIDTH && y < MAPHEIGHT) {
                    let getTile = showBuffer[
                        getArrayIndexFromInt(this.x_,
                            this.y_,
                            this.parent.getCanvasHeightTilesAvailable(),
                            this.parent.getCanvasWidthTilesAvailable())];

                    if (getTile !== null) {
                        ctx.strokeStyle = getIntToColor(getTile);
                        ctx.beginPath();
                        ctx.rect(this.x + (x * TILEWIDTH), this.y + (y * TILEHEIGHT), TILEWIDTH, TILEHEIGHT);
                        ctx.stroke();
                    }
                }
            }
        }
    }

}

function getArrayIndexFromInt(x: number, y: number, w: number, h: number): number {
    return y * w + x;
}

function getIntToColor(n: number): string {
    switch (n) {
        case 0:
            return "orange";
        case 1:
            return "pink";
        case 2:
            return "darkgrey";
        case 3:
            return "black";
        case 4:
            return "white";
        case 5:
            return "purple";
        case 6:
            return "yellow";
        case 7:
            return "green";
        case 8:
            return "blue";
        case 9:
            return "magenta";
    }

    return "darkgreen";
}