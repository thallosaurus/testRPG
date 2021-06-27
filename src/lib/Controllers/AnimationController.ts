import { Drawable } from "../Interfaces/Drawable";
import { UpdatePending } from "../Interfaces/UpdatePending";
import { VisualOffset } from "../Interfaces/VisualOffset";
import Canvas from "./CanvasController";

export class AnimationController implements Drawable {
    static animationQueue: Array<AnimationObject> = [];

    static get timestamp(): number {
        return Canvas.timestamp;
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        for (let a of AnimationController.animationQueue) {
            if (a.changes.length !== 0) {
                let frame = a.changes.shift();
                switch (a.direction) {
                    case "x":
                        console.log(frame);
                        a.element.setVisualOffsetX(frame! * (a.pos ? 1 : -1) - 64, Canvas.timestamp - a.timestamp);
                        break;
                        
                        case "y":
                        console.log(frame);
                        a.element.setVisualOffsetY(frame! * (a.pos ? 1 : -1) - 64, Canvas.timestamp - a.timestamp);
                        break;
                }
            } else {
                //end of animation
                switch (a.direction) {
                    case "x":
                        // console.log("finalized x", a);
                        a.element.finalizeX(a.pos, a.iterations);
                        break;

                    case "y":
                        a.element.finalizeY(a.pos, a.iterations);
                        break;
                }

                // if ('updatePending' in a.element) {
                    // a.element.hasA = false;
                    console.log("released element from pending");
                    // }
                
                this.resetObject(a.element);
                let index = AnimationController.animationQueue.indexOf(a);
                AnimationController.animationQueue.splice(index);
            }
        }

        // console.log(AnimationController.animationQueue);
    }

    resetObject(obj: any) {
        obj.setVisualOffsetY(0, 0);
        obj.setVisualOffsetX(0, 0);
        obj.hasActiveEvent = false;
    }

    static scheduleMapMoveAnimation(vis: VisualOffset, direction: "x" | "y", pos: boolean, distance: number = 1) {
        //generate frames


        //presend the new coords to the server
        let ch = this.generateFrameDiffsMapMovement(1, Math.floor(Canvas.targetFPS) / 2, distance);
        console.log("Changes", ch);

        vis.hasActiveEvent = true;
        this.animationQueue.push({
            element: vis,
            changes: ch,
            direction: direction,
            pos: pos,
            timestamp: this.timestamp,
            iterations: distance
        });
    }

    static generateFrameDiffsMapMovement(min: number, max: number, iterations = 1) {
        let b: number[] = [];

        for (let i = min; i < max * iterations; i++) {
            b.push((1 / max * i) * 64
            );
        }

        return b;
    }
}

interface AnimationObject {
    element: VisualOffset;
    changes: number[];
    direction: "x" | "y";
    pos: boolean;
    timestamp: number;
    iterations: number;
}