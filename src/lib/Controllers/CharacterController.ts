import { MapDrawable } from "../Interfaces/MapDrawable.js";
import { ImageLoader } from "../Interfaces/ResourceLoader.js";
import { SocketSubscriber } from "../Interfaces/SocketSubscriber.js";
import { Character, PlayerDirection } from "../Map/MapObjects/Character.js";
import { SimpleTile } from "../Map/SimpleTile.js";
import { MapUtils } from "../Utilities.js";
import { Mappable, SubMappable, WorldController } from "./WorldController.js";

export class CharacterController implements SubMappable, ImageLoader, SocketSubscriber {
    
    private ownPlayer: Character = new Character(0, 0);

    getMapDataXY(x: number, y: number): MapDrawable | null {
        // throw new Error("Method not implemented.");
        let c = this.characters.find((e) => {
            return e.x === x && e.y === y;
        }) ?? null;

        // if (c !== null) console.log(c);

        return c;
    }

    drawPlayer(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number) {
        this.ownPlayer.drawAt(ctx, 0, x, y, w, h);
    }

    setAnimationProgressOfPlayer(ts: number) {
        this.ownPlayer.setAnimationProgress(ts);
    }

    playerLookAt(dir: PlayerDirection) {
        this.ownPlayer.lookAt(dir);
    }

    private characters: Array<Character> = [];

    constructor() {
        this.characters.push(new Character(3, 3));
    }

    onmessage(ev: MessageEvent<any>): void {
        // throw new Error("Method not implemented.");
        console.log(ev);
    }
    messageId!: string;
    send(): void {
        throw new Error("Method not implemented.");
    }

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return this.ownPlayer.resolveResource();
    }
    unloadResource(): void {
        // throw new Error("Method not implemented.");
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