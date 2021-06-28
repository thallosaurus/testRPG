import { SubMappable } from "../Controllers/WorldController.js";
import { SimpleTile } from "./SimpleTile.js";
import { TiledJSONObjectLayer, TiledJSONObject } from "./TiledJSONMap.js";

export class ObjectLayer implements SubMappable, TiledJSONObjectLayer {
    draworder: string;
    id: number;
    name: string;
    objects: TiledJSONObject[];
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;

    constructor(layer: TiledJSONObjectLayer) {
        this.draworder = layer.draworder;
        this.id = layer.id;
        this.name = layer.name;
        this.objects = layer.objects;
        this.opacity = layer.opacity;
        this.type = layer.type;
        this.visible = layer.visible;
        this.x = layer.x;
        this.y = layer.y;
    }

    getMapDataXY(x: number, y: number): SimpleTile | null {
        // throw new Error("Method not implemented.");
        return null;
        // return this.objects[MapUtils.getI()]
    }
}