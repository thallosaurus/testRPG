export class ObjectLayer {
    constructor(layer) {
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
    getMapDataXY(x, y) {
        return null;
    }
}
//# sourceMappingURL=ObjectLayer.js.map