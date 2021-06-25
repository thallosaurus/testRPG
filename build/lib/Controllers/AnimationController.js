import Canvas from "./CanvasController";
export class AnimationController {
    static get timestamp() {
        return Canvas.timestamp;
    }
    redraw(ctx, timestamp) {
        for (let a of AnimationController.animationQueue) {
            if (a.changes.length !== 0) {
                let frame = a.changes.shift();
                switch (a.direction) {
                    case "x":
                        a.element.setVisualOffsetX(frame * (a.pos ? 1 : -1), Canvas.timestamp - a.timestamp);
                        break;
                    case "y":
                        a.element.setVisualOffsetY(frame * (a.pos ? 1 : -1), Canvas.timestamp - a.timestamp);
                        break;
                }
            }
            else {
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
    static scheduleMapMoveAnimation(vis, direction, pos, distance = 1) {
        let ch = this.generateFrameDiffsMapMovement(0, Math.floor(Canvas.targetFPS) / 2, distance);
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
    static generateFrameDiffsMapMovement(min, max, iterations = 1) {
        let b = [];
        for (let i = min; i < max * iterations; i++) {
            b.push((1 / max * i) * 64);
        }
        return b;
    }
}
AnimationController.animationQueue = [];
//# sourceMappingURL=AnimationController.js.map