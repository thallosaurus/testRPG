import { ObjectLayer } from "./ObjectLayer";
import { TileLayer } from "./TileLayer";
export class GameMap {
    constructor(data) {
        this.resourceUrl = null;
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
                return new ObjectLayer(e);
            }
            return new TileLayer(e);
        });
    }
    unloadResource() {
        GameMap.resource.src = "";
        URL.revokeObjectURL(this.resourceUrl);
        this.resourceUrl = null;
    }
    getArea(x_, y_, width, height) {
        let buf = Array();
        for (let y = y_; y < height + y_; y++) {
            for (let x = x_; x < width + x_; x++) {
                let tile = this.getMapDataXY(x, y);
                buf.push(tile);
            }
        }
        return buf;
    }
    static getLevel(filename) {
        return new Promise((res, rej) => {
            fetch("/assets/levels/" + filename).then(e => {
                return e.json();
            }).then(f => {
                res(new GameMap(f));
            });
        });
    }
    static getResource() {
        return this.resource;
    }
    resolveResource() {
        return new Promise((res, rej) => {
            fetch("/assets/maps/test.png").then(e => {
                return e.blob();
            }).then((blob) => {
                this.resourceUrl = URL.createObjectURL(blob);
                GameMap.resource = new Image();
                GameMap.resource.src = this.resourceUrl;
                res();
            });
        });
    }
    getMapDataXY(x, y) {
        return this.returnAcrossLayers(x, y);
    }
    returnAcrossLayers(x, y) {
        let b = [];
        for (let l of this.loadedLayers) {
            if (l)
                b.push(l === null || l === void 0 ? void 0 : l.getMapDataXY(x, y));
        }
        return b;
    }
}
GameMap.resource = null;
function isTileLayer(obj) {
    return obj.type === "tilelayer";
}
function isObjectLayer(obj) {
    return obj.type === "objectgroup";
}
//# sourceMappingURL=GameMap.js.map