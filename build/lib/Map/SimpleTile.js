import { MapUtils } from "../Utilities";
import { GameMap } from "./GameMap";
export class SimpleTile {
    constructor(t) {
        this.id = t - 1;
    }
    get spriteId() {
        return this.id;
    }
    drawAt(ctx, timestamp, x, y, w, h) {
        if (this.id != 0) {
            let coords = MapUtils.getXY(this.id, 30, 30);
            ctx.drawImage(GameMap.getResource(), coords.x * 32, coords.y * 32, 32, 32, x, y, w, h);
        }
    }
    drawDbg(ctx, timestamp, x, y, w, h) {
        if (this.id === 0)
            return;
        ctx.strokeStyle = MapUtils.indexToColor(this.id);
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = MapUtils.indexToColor(this.id);
        ctx.stroke();
    }
}
//# sourceMappingURL=SimpleTile.js.map