import RequestedFile from "../lib/RequestedFile.js";
import { Sprites } from '../sprites/Sprite.js'

export namespace Map {
    export class Map extends RequestedFile implements Sprites.Drawable {

        // private readonly filename: string;
        private x: number;
        private y: number;

        constructor() {
            super();
            this.x = 0;
            this.y = 0;
        }
        
        onDraw(ctx: CanvasRenderingContext2D): void {
            throw new Error("Method not implemented.");
        }

        static async loadMapJson(filename: string) {
            await RequestedFile.load("/assets/maps/" + filename);
        }
    }
}