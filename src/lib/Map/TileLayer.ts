import { SubMappable } from "../Controllers/WorldController.js";
import { MapUtils } from "../Utilities.js";
import { SimpleTile } from "./SimpleTile.js";
import { TiledJSONLevelLayer, TiledJSONLevelLayerProperties } from "./TiledJSONMap";

export class TileLayer implements SubMappable, TiledJSONLevelLayer {
    // private layerData: Array<SimpleTile> = [];

    data: number[];
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
    properties: TiledJSONLevelLayerProperties[];
    height: number;
    width: number;

    loadedTiles: Array<SimpleTile>;

    constructor(layer: TiledJSONLevelLayer) {
        this.data = layer.data;
        this.id = layer.id;
        this.name = layer.name;
        this.opacity = layer.opacity;
        this.type = layer.type;
        this.visible = layer.visible;
        this.x = layer.x;
        this.y = layer.y;
        this.properties = layer.properties;
        this.height = layer.height;
        this.width = layer.width;

        this.loadedTiles = layer.data.map(e => {
            return new SimpleTile(e);
        });
    }

    getMapDataXY(x: number, y: number): SimpleTile | null {
        // throw new Error("Method not implemented.");
        if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;
        let i = MapUtils.getI(x, y, this.width);

        let tile = this.loadedTiles[i];
        if (tile.spriteId === -1) return null;
        if (tile === undefined) return null;
        return tile;
    }
}