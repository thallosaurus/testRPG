import { Drawable } from "../Interfaces/Drawable.js";
import { VisualOffset } from "../Interfaces/VisualOffset.js";
import Canvas from "./CanvasController.js";

export class AnimationController implements Drawable {
    static animationQueue: Array<AnimationObject> = [];

    static get timestamp() : number{
        return Canvas.timestamp;
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        for (let a of AnimationController.animationQueue) {
            if (a.changes.length !== 0) {
                let frame = a.changes.shift();
                switch (a.direction) {
                    case "x":
                        a.element.setVisualOffsetX(frame! * (a.pos ? 1 : -1), Canvas.timestamp - a.timestamp);
                        break;

                    case "y":
                        a.element.setVisualOffsetY(frame! * (a.pos ? 1 : -1), Canvas.timestamp - a.timestamp);
                        break;
                }
            } else {
                switch (a.direction) {
                    case "x":
                        a.element.finalizeX(a.pos, a.iterations);
                        a.element.setVisualOffsetX(0, 0);
                        break;

                    case "y":
                        a.element.finalizeY(a.pos, a.iterations);
                        a.element.setVisualOffsetY(0, 0);
                        break;
                }

                a.element.hasActiveEvent = false;
                let index = AnimationController.animationQueue.indexOf(a);
                AnimationController.animationQueue.splice(index);
            }
        }
    }

    static scheduleMapMoveAnimation(vis: VisualOffset, direction: "x" | "y", pos: boolean, distance: number = 1) {
        //generate frames
        let ch = this.generateFrameDiffsMapMovement(0, Math.floor(Canvas.targetFPS), distance);

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
            b.push((1 / max * i) * 64);
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