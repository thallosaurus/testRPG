import { MapDrawable } from "../Interfaces/MapDrawable.js";
import { Character } from "../Map/MapObjects/Character.js";
import { SimpleTile } from "../Map/SimpleTile.js";
import { MapUtils } from "../Utilities.js";
import { Mappable, SubMappable, WorldController } from "./WorldController.js";

export class CharacterController implements SubMappable {
    getMapDataXY(x: number, y: number): MapDrawable | null {
        // throw new Error("Method not implemented.");
        let c = this.characters.find((e) => {
            return e.x === x && e.y === y;
        }) ?? null;

        // if (c !== null) console.log(c);

        return c;
    }

    private characters: Array<Character> = [];

    constructor() {
        this.characters.push(new Character(5, 5));
    }
}