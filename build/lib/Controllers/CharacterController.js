import { MultiplayerClient } from "../Client/SocketClient";
import { Character } from "../Map/MapObjects/Character";
export class CharacterController {
    constructor() {
        this.ownPlayer = new Character(0, 0);
        this.client = new MultiplayerClient.Client("ws://localhost:4000");
        this.characters = [];
    }
    getMapDataXY(x, y) {
        var _a;
        let c = (_a = this.characters.find((e) => {
            return e.x === x && e.y === y;
        })) !== null && _a !== void 0 ? _a : null;
        return c;
    }
    drawPlayer(ctx, x, y, w, h) {
        this.ownPlayer.drawAt(ctx, 0, x, y, w, h);
    }
    setAnimationProgressOfPlayer(ts) {
        this.ownPlayer.setAnimationProgress(ts);
    }
    playerLookAt(dir) {
        this.ownPlayer.lookAt(dir);
    }
    resolveResource() {
        return this.ownPlayer.resolveResource();
    }
    unloadResource() {
        this.ownPlayer.unloadResource();
    }
    allCharsUp() {
        this.characters.forEach(e => {
            e.moveUp(1);
        });
    }
    allCharsDown() {
        this.characters.forEach(e => {
            e.moveDown(1);
        });
    }
    allCharsLeft() {
        this.characters.forEach(e => {
            e.moveLeft(1);
        });
    }
    allCharsRight() {
        this.characters.forEach(e => {
            e.moveRight(1);
        });
    }
}
//# sourceMappingURL=CharacterController.js.map