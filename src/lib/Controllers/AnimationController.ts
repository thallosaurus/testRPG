import { Drawable } from "../Interfaces/Drawable";
import { UpdatePending } from "../Interfaces/UpdatePending";
import { VisualOffset } from "../Interfaces/VisualOffset";
import { PlayerDirection } from "../Map/MapObjects/Character";
import { ObjectRegistry } from "../ObjectRegistry";
import Canvas from "./CanvasController";
import { WorldController } from "./WorldController";

export class AnimationController implements Drawable {
    static animationQueue: Array<AnimationObject> = [];

    static get timestamp(): number {
        return Canvas.timestamp;
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        for (let a of AnimationController.animationQueue) {
            if (a.changes.length !== 0) {
                let frame = a.changes.shift();
                if (frame !== null) switch (a.direction) {
                    case "x":
                        a.element.setVisualOffsetX(frame!, Canvas.timestamp - a.timestamp);
                        break;

                    case "y":

                        a.element.setVisualOffsetY(frame! , Canvas.timestamp - a.timestamp);
                        break;
                }
            } else {
                a.changes = [];
                let o = a.element;
                this.resetObject(o);
                if (a.element instanceof WorldController) {
                    ObjectRegistry.enableInteraction();
                    console.log(a.element);
                }
                let index = AnimationController.animationQueue.indexOf(a);
                AnimationController.animationQueue.splice(index, 1);
            }
        }
    }
    
    resetObject(obj: VisualOffset) {
        obj.setVisualOffsetY(0, 0);
        obj.setVisualOffsetX(0, 0);
    }

    static scheduleMapMoveAnimation(vis: VisualOffset, direction: PlayerDirection, count: number = 1) {
        let ticket = ({
            element: vis,
            changes: [0,0,0,0],
            direction: "x",
            timestamp: this.timestamp,
            iterations: count
        });

        let frame:Array<number> = [];
        switch (direction) {
            case PlayerDirection.LEFT:
                frame = this.createPosFrames(count);
                ticket.changes = frame;
                ticket.direction = "x";
            break;

            case PlayerDirection.RIGHT:
                frame = this.createNegFrames(count);
                ticket.changes = frame;
                ticket.direction = "x";
            break;

            case PlayerDirection.UP:
                frame = this.createPosFrames(count);
                ticket.changes = frame;
                ticket.direction = "y";
                break;

            case PlayerDirection.DOWN:
                frame = this.createNegFrames(count);
                ticket.changes = frame;
                ticket.direction = "y";
            break;
        }

        this.animationQueue.push(ticket);
    }

    static createPosFrames(count: number, distance: number = 64) {
        let frames = [];
        let targetFrames = Canvas.targetFPS / 2;
        let inc = 64 / targetFrames;
        for (let i = -64; i < 0; i += inc) {
            frames.push(i);
        }
        return frames;
    }

    static createNegFrames(count: number, distance: number = 64) {
        let frames = [];
        let targetFrames = Canvas.targetFPS / 2;
        let inc = 64 / targetFrames;
        for (let i = 64; i > 0; i -= inc) {
            frames.push(i);
        }
        return frames;
    }
}

interface AnimationObject {
    element: VisualOffset;
    changes: number[];
    direction: string;
    timestamp: number;
    iterations: number;
}