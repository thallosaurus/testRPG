import { Mappable, SubMappable } from "../Controllers/WorldController.js";
import { ImageLoader } from "../Interfaces/ResourceLoader.js";
import { ObjectLayer } from "./ObjectLayer.js";
import { SimpleTile } from "./SimpleTile.js";
import { TiledJSONLevelLayer, TiledJSONMap, TiledJSONObjectLayer } from "./TiledJSONMap.js";
import { TileLayer } from "./TileLayer.js";

export class GameMap implements Mappable, TiledJSONMap, ImageLoader {
    // layer_: (SimpleLayer | ObjectLayer)[] = [];

    width: number;
    height: number;

    compressionlevel: number;
    infinite: boolean;
    layers: (TiledJSONLevelLayer | TiledJSONObjectLayer)[];
    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    type: string;
    version: string;

    loadedLayers: Array<SubMappable>;

    resourceUrl: string | null = null;
    static resource: HTMLImageElement | null = null;

    constructor(data: TiledJSONMap) {
        this.width = data.width;
        this.height = data.height;
        this.compressionlevel = data.compressionlevel;
        this.infinite = data.infinite;
        this.tiledversion = data.tiledversion;
        this.tilewidth = data.tilewidth;
        this.tileheight = data.tileheight;
        this.type = data.type;
        this.version = data.version;
        this.layers = data.layers;


        this.loadedLayers = this.layers.map(e => {
            if (isObjectLayer(e)) {
                return new ObjectLayer(e as any);
            }

            // if (isTileLayer(e)) {
            return new TileLayer(e as any);
            // }
        });
    }
    unloadResource(): void {
        URL.revokeObjectURL(this.resourceUrl!);
    }

    public getArea(x_: number, y_: number, width: number, height: number): Array<Array<SimpleTile | null>> {
        let buf = Array<Array<SimpleTile | null>>();
        for (let y = y_; y < height + y_; y++) {
            for (let x = x_; x < width + x_; x++) {
                let tile = this.getMapDataXY(x, y);
                buf.push(tile);
            }
        }

        return buf;
    }

    static getLevel(filename: string): Promise<GameMap> {
        return new Promise<GameMap>((res, rej) => {
            fetch("/assets/levels/" + filename).then(e => {
                return e.json();
            }).then(f => {
                res(new GameMap(f));
            });
        });
    }

    static getResource(): HTMLImageElement | null {
        // throw new Error("Method not implemented.");
        return this.resource;
    }

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return new Promise<void>((res, rej) => {
            fetch("/assets/maps/test.png").then(e => {
                return e.blob();
            }).then((blob: Blob) => {
                this.resourceUrl = URL.createObjectURL(blob);
                GameMap.resource = new Image();
                GameMap.resource.src = this.resourceUrl;
                res();
            });
        })
    }

    public getMapDataXY(x: number, y: number): (SimpleTile | null)[] {
        // throw new Error("Method not implemented.");
        return this.returnAcrossLayers(x, y);
    }

    private returnAcrossLayers(x: number, y: number): Array<SimpleTile | null> {
        let b = [];

        for (let l of this.loadedLayers) {
            if (l) b.push(l?.getMapDataXY(x, y));
        }

        return b;
    }
}

function isTileLayer(obj: any): obj is TileLayer {
    return obj.type === "tilelayer";
}

function isObjectLayer(obj: any): obj is ObjectLayer {
    return obj.type === "objectgroup";
}

