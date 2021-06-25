import { MapUtils } from "../Utilities";
import { SimpleTile } from "./SimpleTile";
export class TileLayer {
    constructor(layer) {
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
    getMapDataXY(x, y) {
        if (x >= this.width || y >= this.height || x < 0 || y < 0)
            return null;
        let i = MapUtils.getI(x, y, this.width);
        let tile = this.loadedTiles[i];
        if (tile.spriteId === -1)
            return null;
        if (tile === undefined)
            return null;
        return tile;
    }
}
//# sourceMappingURL=TileLayer.js.map