import CanvasController from "./CanvasController.js";
import Canvas, { Drawable } from "./CanvasController.js";
import Player, { Direction } from "./Sprite.js";
// import Player from "./Sprite.js";

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;

export interface MapDrawable {
    drawAt(ctx: CanvasRenderingContext2D, x: number, y: number, xd: number, yd: number): void;
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

    private map!: Array<Tile>;

    private x_: number = 0;
    private y_: number = 0;
    private xAnimOffset = 0;
    private yAnimOffset = 0;
    private mw: number;
    private mh: number;
    private spriteUrl: string;
    private texture!: HTMLImageElement | null;
    private layer: Array<Array<Tile>> = new Array<Array<Tile>>();
    private textureUrl!: string;
    public running = false;

    public moving = false;

    get textureLoaded() {
        return this.texture !== null;
    }
    private readonly player: Player;

    /*     public get x() {
            return this.parent.getCanvasHeightTilesAvailable()
        } */

    private checkLayers(xOffset = 0, yOffset = 0): boolean {
        let forbiddenItems = [781];
        for (let l = 0; l < this.layer.length; l++) {
            let d = this.getMapDataXY(this.layer[l], this.player.getOwnX() + xOffset + 1, this.player.getOwnY() + yOffset + 1);
            // console.log(d);
            if (d === null) {
                return l !== 0;
            } else {
                if (d.n === null && l === 0) return false;
                // console.log(d);
                if (forbiddenItems.includes(d.n === null ? -1 : d.n)) {
                    return false;
                }
            }
        }

        return true;
    }

    public tp() {
        let t = this.getMapDataXY(this.layer[2],
            this.player.getOwnX(),
            this.player.getOwnY());
            // console.log(this.player.getOwnX(),
            // this.player.getOwnY(),
            // t);

        if (t !== null) {
            if (t.isEvented()){
                this.parent.changeWorld(t.event!);
            }
        }
    }

    private canPlayerMoveLeft() {
        return (this.player.getOwnX() >= 0) && this.checkLayers(-1, 0);
    }

    private canPlayerMoveRight() {
        // console.log(this.player.getOwnX());
        return (this.player.getOwnX() < this.mw - 2) && this.checkLayers(1, 0);
    }

    private canPlayerMoveUp() {
        // console.log(this.player.getOwnX());
        return (this.player.getOwnY() >= 0) && this.checkLayers(0, -1);
    }

    private canPlayerMoveDown() {
        // console.log(this.player.getOwnX());
        // let downX = 
        return (this.player.getOwnY() < this.mw + 1) && this.checkLayers(0, 1);
    }

    public async incX() {
        // this.x_++;
        this.player.lookAt(Direction.RIGHT)
        if (!this.moving && this.canPlayerMoveRight()) {
            this.moveMapSmooth(this.x_ + 1, this.y_);
            this.player.incX();

        }
        console.log(this.player.getOwnX());
    }

    public decX() {
        this.player.lookAt(Direction.LEFT)
        if (!this.moving && this.canPlayerMoveLeft()) {
            // this.x_--;
            this.moveMapSmooth(this.x_ - 1, this.y_);
            this.player.decX();
        }
        console.log(this.player.getOwnX());
    }
    public incY() {
        this.player.lookAt(Direction.DOWN)
        if (!this.moving && this.canPlayerMoveDown()) {
            this.moveMapSmooth(this.x_, this.y_ + 1);
            // this.y_++;
            this.player.incY();
        }
    }

    public decY() {
        this.player.lookAt(Direction.UP)
        if (!this.moving && this.canPlayerMoveUp()) {
            this.moveMapSmooth(this.x_, this.y_ - 1);
            // this.y_--;
            this.player.decY();
        }
    }

    get x(): number {
        return this.x_ * TILEWIDTH;
    }
    get y(): number {
        return this.y_ * TILEWIDTH;
    }

    get tilewidth(): number {
        return TILEWIDTH;
    }

    get tileheight(): number {
        return TILEHEIGHT;
    }

    get viewwidth(): number {
        return this.parent.getCanvasWidthTilesAvailable();
    }

    get viewheight(): number {
        return this.parent.getCanvasHeightTilesAvailable();
    }

    get mapwidth(): number {
        return this.mw;
    }

    get mapheight(): number {
        return this.mh;
    }

    get sprite(): HTMLImageElement {
        return this.texture!;
    }

    set map_(m: Array<Tile>) {
        this.map = m;
    }

    get middleX() {
        return this.viewwidth / 2
    }

    get middleY() {
        return this.viewheight / 2
    }

    get middleXScaled() {
        return this.middleX * this.tilewidth;
    }

    get middleYScaled() {
        return this.middleY * this.tileheight;
    }

    constructor(mapWidth: number, mapHeight: number, url: string, spawnX: number, spawnY: number, parent: CanvasController) {
        // this.map = mapData;
        this.mw = mapWidth;
        this.mh = mapHeight;
        this.spriteUrl = url;
        this.player = new Player(this);
        this.x_ = spawnX;
        this.y_ = spawnY;
        this.parent = parent;
    }

    /*     private prepareTexture(blob: Blob) {
            let img = new Image();
            this.spriteUrl = URL.createObjectURL(blob);
            img.src = this.spriteUrl;
            return img;
        } */

    public addLayer(layer: Array<Tile>) {
        this.layer.push(layer);
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
                // res();
                // res(blob);
            }).then(() => {
                return this.player.resolveSprites();
            }).then(res)
        });
    }

    static loadMap(filename: string, parent: CanvasController) {
        return new Promise<World>((res, rej) => {
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

                let w = new World(json.width, json.height, json.spritesheet, json.spawnX, json.spawnY, parent)

                let d_final = json.mapped.map((e: any) => new Tile(e, w));
                // w.map_ = d_final;
                w.addLayer(d_final);

                // let o = new World(json.width, json.height, json.spritesheet, json.spawnX, json.spawnY, parent);
                let o_final = json.objects.map((e: any) => new Tile(e, w));
                w.addLayer(o_final);
                w.addTeleports(json.teleports);
                res(w);
            });
        });
    }

    moveMapSmooth(x: number, y: number) {
        let resolution = 50;
        let p = new Promise<void>(async (res, rej) => {
            this.moving = true;
            let i = 0;
            let xdiff = this.x_ - x;
            let ydiff = this.y_ - y;

            console.log(xdiff, ydiff);

            while (i !== resolution) {
                let newX = (xdiff / resolution) * i;
                let newY = (ydiff / resolution) * i;
                this.xAnimOffset = newX;
                this.yAnimOffset = newY;
                let g = await (new Promise<void>((res_, rej) => {
                    setTimeout(res_, (this.running ? 100 : 250) / resolution);
                }));
                // console.log(newX, newY);
                i++;
            }
            this.x_ -= xdiff;
            this.y_ -= ydiff;
            this.xAnimOffset = 0;
            this.yAnimOffset = 0;
            this.moving = false;
            this.tp();
            res();
        });

        this.player.startAnimation(p);

        return p;
    }

    /*     static loadTextures(config: any) {
            return new Promise<Blob>((res, rej) => {
    
            })
        } */

    getAreaFromData(layer: Array<Tile>, xIn: number, yIn: number, w: number, h: number): Array<Tile | null> {
        let buffer = Array<Tile | null>();

        // console.log(xIn, yIn, w, h);

        // console.log(x, y, w, h);
        let i = 0;
        for (let y = yIn; y < h + yIn; y++) {
            for (let x = xIn; x < w + xIn; x++) {
                buffer.push(this.getMapDataXY(layer, x, y));
                i++;
            }
        }

        return buffer;

    }

    private getMapDataXY(arr: Array<Tile>, x: number, y: number): Tile | null {
        // return this.map.getArrayIndexFromInt(x, y, MAPWIDTH, MAPHEIGHT);
        if (x >= this.mapwidth || y >= this.mapheight || x < 0 || y < 0) return null;

        let index = getArrayIndexFromInt(x, y, this.mapwidth, this.mapheight);
        let d = arr[index];
        if (d === undefined) return null;
        // if (d.n < 0) return null;
        return d;
    }

    redraw(ctx: CanvasRenderingContext2D): void {
        // throw new Error("Method not implemented.");
        for (let l of this.layer) {
            if (this.texture === null) return;
            let showBuffer = this.getAreaFromData(
                l,
                this.x_ - this.middleX,
                this.y_ - this.middleY,
                this.viewwidth,
                this.viewheight);
            // console.log(showBuffer);
            for (let y = 0; y < this.viewheight; y++) {
                for (let x = 0; x < this.viewwidth; x++) {
                    let i = getArrayIndexFromInt(x,
                        y,
                        this.viewwidth,
                        this.viewheight);
                    let tile = showBuffer[i];

                    if (tile !== null) {
                        tile.draw(ctx, (this.xAnimOffset + x) * this.tilewidth, (this.yAnimOffset + y) * this.tileheight, this.tilewidth, this.tileheight);
                    }
                }
            }
        }

        this.player.draw(ctx, this.middleXScaled, this.middleYScaled, this.tilewidth, this.tileheight);
    }

    public startRunning() {
        this.running = true;
        console.log(this.running);
    }

    public stopRunning() {
        this.running = false;
        console.log(this.running);
    }

    public unloadWorld() {
        this.texture = null;
        for (let l of this.layer) {
            for (let m of l) {
                if (m !== null) {
                    // m.texture = null;
                    m.turnOff();
                }
            }
        }
        console.log(this.textureUrl, this.texture);
        URL.revokeObjectURL(this.textureUrl);
    }

    public addTeleports(te: Array<TeleportEvents>) {
        let layer = new Array<Tile>(this.mw * this.mh).fill(new Tile(null, this, null));
        
        for (let teleport of te) {
            layer[getArrayIndexFromInt(teleport.x - 1, teleport.y - 1, this.mw, this.mh)] = new Tile(null, this, teleport.destination);
        }

        this.layer.push(layer);
    }
}

interface TeleportEvents {
        
            x:number;
            y:number;
            destination:string;
        
}

class ObjectsWorld extends World {
    constructor(mapWidth: number, mapHeight: number, url: string, spawnX: number, spawnY: number, parent: CanvasController) {
        super(mapWidth, mapHeight, url, spawnX, spawnY, parent);
    }
}

export interface DrawTomap {
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
}

class Tile implements DrawTomap {
    private tiledata: number | null;
    // private texture: HTMLImageElement;
    private parent: World;

    private readonly SPRITESHEET_WIDTH = 30;
    private readonly SPRITESHEET_HEIGHT = 30;

    private readonly ONETILEWIDTH = 32;
    private readonly ONETILEHEIGHT = 32;

    public event: string | null = null;

    get n(): number | null {
        return this.tiledata;
    }

    public turnOff() {
        this.tiledata = null;
    }

    get texture(): HTMLImageElement {
        return this.parent.sprite;
    }

    constructor(d: number | null, parent: World, event:string | null = null) {
        this.tiledata = d;
        this.parent = parent;
        if (event !== null) this.setEvent(event);
    }

    public isEvented() {
        return this.event !== null;
    }

    setEvent(e: string) {
        this.event = e;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        ctx.fillStyle = this.getIntToColor(this.tiledata);
        ctx.fillRect((x * w), (y * h), w, h);

        if (this.tiledata !== null && this.parent.textureLoaded !== null) {
            (this.tiledata % this.SPRITESHEET_WIDTH, Math.floor(this.tiledata / this.SPRITESHEET_HEIGHT));
            try {
            ctx.drawImage(
                this.texture,
                this.tiledata % this.SPRITESHEET_WIDTH * this.ONETILEWIDTH,
                Math.floor(this.tiledata / this.SPRITESHEET_HEIGHT) * this.ONETILEHEIGHT,
                this.ONETILEWIDTH,
                this.ONETILEHEIGHT,
                x,
                y,
                w,
                h);
            } catch (e) {

            }
        }
        // console.log(i);
    }

    getIntToColor(n: number | null): string {
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
}

function getArrayIndexFromInt(x: number, y: number, w: number, h: number): number {
    return y * w + x;
}