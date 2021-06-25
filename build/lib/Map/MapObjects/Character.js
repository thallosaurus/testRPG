import { AnimationController } from "../../Controllers/AnimationController";
import { MapUtils } from "../../Utilities";
export class Character {
    constructor(x, y) {
        this.progress = 0;
        this.direction = PlayerDirection.DOWN;
        this.hasActiveEvent = false;
        this.visualXOffset = 0;
        this.visualYOffset = 0;
        this.x = 0;
        this.y = 0;
    }
    drawAt(ctx, timestamp, x, y, w, h) {
        ctx.fillStyle = MapUtils.indexToColor(this.progress);
        if (Character.image === null)
            return;
        ctx.drawImage(Character.image, this.progress * 64, this.direction * 64, 64, 64, x + this.getVisualOffsetX(), y + this.getVisualOffsetY(), w, h);
    }
    setAnimationProgress(ts) {
        this.progress = Math.floor(ts / 125) % 4;
    }
    lookAt(direction) {
        this.direction = direction;
    }
    setVisualOffsetX(x, ts) {
        this.setAnimationProgress(ts);
        this.visualXOffset = x;
    }
    setVisualOffsetY(y, ts) {
        this.setAnimationProgress(ts);
        this.visualYOffset = y;
    }
    getVisualOffsetX() {
        return this.visualXOffset;
    }
    getVisualOffsetY() {
        return this.visualYOffset;
    }
    finalizeX(pos, amount) {
        this.visualXOffset = 0;
        this.x += (pos ? 1 : -1) * amount;
    }
    finalizeY(pos, amount) {
        this.visualYOffset = 0;
        this.y += (pos ? 1 : -1) * amount;
    }
    moveUp(distance) {
        this.lookAt(PlayerDirection.UP);
        AnimationController.scheduleMapMoveAnimation(this, "y", false, distance);
    }
    moveDown(distance) {
        this.lookAt(PlayerDirection.DOWN);
        AnimationController.scheduleMapMoveAnimation(this, "y", true, distance);
    }
    moveLeft(distance) {
        this.lookAt(PlayerDirection.LEFT);
        AnimationController.scheduleMapMoveAnimation(this, "x", false, distance);
    }
    moveRight(distance) {
        this.lookAt(PlayerDirection.RIGHT);
        AnimationController.scheduleMapMoveAnimation(this, "x", true, distance);
    }
    resolveResource() {
        return new Promise((res, rej) => {
            if (Character.image !== null)
                res();
            fetch("/assets/sprites/player.png").then(e => {
                return e.blob();
            }).then(blob => {
                Character.imageUrl = URL.createObjectURL(blob);
                Character.image = new Image();
                Character.image.src = Character.imageUrl;
                res();
            });
        });
    }
    unloadResource() {
    }
}
Character.imageUrl = null;
Character.image = null;
export var PlayerDirection;
(function (PlayerDirection) {
    PlayerDirection[PlayerDirection["DOWN"] = 0] = "DOWN";
    PlayerDirection[PlayerDirection["LEFT"] = 1] = "LEFT";
    PlayerDirection[PlayerDirection["RIGHT"] = 2] = "RIGHT";
    PlayerDirection[PlayerDirection["UP"] = 3] = "UP";
})(PlayerDirection || (PlayerDirection = {}));
//# sourceMappingURL=Character.js.map