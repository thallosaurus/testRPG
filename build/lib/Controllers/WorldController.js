var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Canvas from "./CanvasController";
import { AnimationController } from "./AnimationController";
import { CharacterController } from "./CharacterController";
import { PlayerDirection } from "../Map/MapObjects/Character";
export class WorldController {
    constructor() {
        this.currentMap = null;
        this.spriteWidth = 64;
        this.spriteHeight = 64;
        this.visualXOffset = 0;
        this.visualYOffset = 0;
        this.hasActiveEvent = false;
        this.x_ = 4;
        this.y_ = 4;
        this.charCont = new CharacterController();
    }
    get tilesAvailableY() {
        return Canvas.height / this.tileHeight;
    }
    get tilesAvailableX() {
        return Canvas.width / this.tileWidth;
    }
    get tileWidth() {
        return this.spriteWidth;
    }
    get tileHeight() {
        return this.spriteHeight;
    }
    get map() {
        return this.currentMap;
    }
    setVisualOffsetX(x, ts) {
        this.charCont.setAnimationProgressOfPlayer(ts);
        this.visualXOffset = x;
    }
    setVisualOffsetY(y, ts) {
        this.charCont.setAnimationProgressOfPlayer(ts);
        this.visualYOffset = y;
    }
    getVisualOffsetX() {
        return this.visualXOffset + (this.tileWidth / 2);
    }
    getVisualOffsetY() {
        return this.visualYOffset + (this.tileHeight / 2);
    }
    finalizeX(pos, distance) {
        this.x_ += (pos ? -1 : 1) * distance;
        this.charCont.setAnimationProgressOfPlayer(0);
    }
    finalizeY(pos, distance) {
        this.y_ += (pos ? -1 : 1) * distance;
        this.charCont.setAnimationProgressOfPlayer(0);
    }
    onKeyboardEvent(e) {
        var _a;
        console.log(e);
        if (this.hasActiveEvent)
            return;
        switch (e.key) {
            case "w":
                this.movePlayerUp();
                break;
            case "a":
                this.movePlayerLeft();
                break;
            case "s":
                this.movePlayerDown();
                break;
            case "d":
                this.movePlayerRight();
                break;
            case "ArrowUp":
                this.charCont.allCharsUp();
                break;
            case "ArrowLeft":
                this.charCont.allCharsLeft();
                break;
            case "ArrowDown":
                this.charCont.allCharsDown();
                break;
            case "ArrowRight":
                this.charCont.allCharsRight();
                break;
            case "u":
                console.log("u");
                (_a = this.currentMap) === null || _a === void 0 ? void 0 : _a.unloadResource();
                break;
        }
    }
    movePlayerUp() {
        this.charCont.playerLookAt(PlayerDirection.UP);
        if (this.check(this.map.getMapDataXY(this.x, this.y - 1)) && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y - 1)))
            AnimationController.scheduleMapMoveAnimation(this, "y", true);
    }
    movePlayerDown() {
        this.charCont.playerLookAt(PlayerDirection.DOWN);
        if (this.check(this.map.getMapDataXY(this.x, this.y + 1)) && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y + 1)))
            AnimationController.scheduleMapMoveAnimation(this, "y", false);
    }
    movePlayerLeft() {
        this.charCont.playerLookAt(PlayerDirection.LEFT);
        if (this.check(this.map.getMapDataXY(this.x - 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x - 1, this.y)))
            AnimationController.scheduleMapMoveAnimation(this, "x", true);
    }
    movePlayerRight() {
        this.charCont.playerLookAt(PlayerDirection.RIGHT);
        if (this.check(this.map.getMapDataXY(this.x + 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x + 1, this.y)))
            AnimationController.scheduleMapMoveAnimation(this, "x", false);
    }
    checkNPC(o) {
        console.log(o);
        if (o === null)
            return true;
        return false;
    }
    check(o) {
        console.log(o);
        if (o[0] === null)
            return false;
        return true;
    }
    get x() {
        return this.x_;
    }
    get y() {
        return this.y_;
    }
    loadMap(m) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.map) === null || _a === void 0 ? void 0 : _a.unloadResource();
            yield m.resolveResource();
            this.currentMap = m;
            yield this.charCont.resolveResource();
        });
    }
    redraw(ctx, timestamp) {
        if (isAMapLoaded(this.map)) {
            for (let y = -2; y < this.tilesAvailableY + 1; y++) {
                for (let x = -2; x < this.tilesAvailableX + 1; x++) {
                    let data = this.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
                    for (let mapdata of data) {
                        mapdata === null || mapdata === void 0 ? void 0 : mapdata.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
                    }
                }
            }
            for (let y = -2; y < this.tilesAvailableY + 1; y++) {
                for (let x = -2; x < this.tilesAvailableX + 1; x++) {
                    let char = this.charCont.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
                    char === null || char === void 0 ? void 0 : char.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
                }
            }
            this.charCont.drawPlayer(ctx, Math.floor(this.tilesAvailableX / 2) * this.tileWidth + this.tileWidth / 2, Math.floor(this.tilesAvailableY / 2) * this.tileHeight + this.tileHeight / 2, this.tileWidth, this.tileHeight);
        }
    }
    redrawDbg(ctx, timestamp) {
        var _a;
        if (isAMapLoaded(this.map)) {
            for (let y = -2; y < this.tilesAvailableY + 1; y++) {
                for (let x = -2; x < this.tilesAvailableX + 1; x++) {
                    let data = this.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
                    for (let mapdata of data) {
                        (_a = mapdata === null || mapdata === void 0 ? void 0 : mapdata.drawDbg) === null || _a === void 0 ? void 0 : _a.call(mapdata, ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
                    }
                    let char = this.charCont.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
                }
            }
        }
    }
}
function isAMapLoaded(map) {
    return map !== null;
}
//# sourceMappingURL=WorldController.js.map