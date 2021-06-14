import Canvas, { Drawable } from "./CanvasController.js";

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;

export default class MapData implements Drawable {
    readonly TILEWIDTH = 32;
    readonly TILEHEIGHT = 32;
    private zoomlevel: number = 2;

    readonly MAPWIDTH:number;
    readonly MAPHEIGHT:number;

    private mapdata!: Array<MapTile>;
    private objectdata!: Array<MapTile>;
    private ogSpriteSheet: string;
    
    public currentAreaX: number = 0;
    public currentAreaY: number = 0;

    private objectsRendering: boolean = true;
    // private spriteData!: /* Spritesheet */HTMLImageElement;
    public spritesheet?: HTMLImageElement;
    public spritePath!: string;
    private parent: Canvas;
    constructor(mapdata_: Level, parent: Canvas) {
        this.parent = parent;
        this.ogSpriteSheet = mapdata_.spritesheet;
        this.MAPWIDTH = mapdata_.width;
        this.MAPHEIGHT = mapdata_.height;
        this.mapdata = this.prepareMap(mapdata_.mapped);
        this.objectdata = this.prepareMap(mapdata_.objects);
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
                if (tile !== null) {
                    tile.drawAt(
                        ctx,
                        this.TILEWIDTH * x,
                        this.TILEHEIGHT * y,
                        this.TILEWIDTH * this.currentAreaX,
                        this.TILEHEIGHT * this.currentAreaY);
                }

            }
        }
    }

    private getArea(x:number, y:number, w:number, h:number) {
        let b = [];
        for (let iy = 0; iy < h; iy++) {
            for (let ix = 0; ix < w; ix++) {
                let offset = iy * this.MAPWIDTH + ix;
                if (ix < this.MAPWIDTH || iy < this.MAPHEIGHT) {
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
    height:number;
    spritesheet: string;
    mapped: Array<number>;
    objects: Array<number>;
    // collision: Array<boolean>;
}