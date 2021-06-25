import Canvas from "./CanvasController";
export class MobileController {
    constructor() {
        this.imageUrl = null;
        this.image = null;
        this.updateTouchEvents();
    }
    onKeyboardEvent(e) {
        throw new Error("Method not implemented.");
    }
    onTouchEvent(e) {
        let c = MobileController.touchEvents.filter(t => {
            return (e.changedTouches[0].clientX > t.x && e.changedTouches[0].clientY > t.y && e.changedTouches[0].clientX < t.x + t.width && e.changedTouches[0].clientY < t.y + t.height);
        });
        if (c.length === 1) {
            c[0].callback();
        }
    }
    get dpadX() {
        return 0;
    }
    get dpadY() {
        return Canvas.height - 160;
    }
    get dpadWidth() {
        return 160;
    }
    get dpadHeight() {
        return 160;
    }
    resolveResource() {
        return new Promise((res, rej) => {
            fetch("/assets/controls/dpad.png")
                .then(f => {
                return f.blob();
            }).then(blob => {
                this.imageUrl = URL.createObjectURL(blob);
                this.image = new Image();
                this.image.src = this.imageUrl;
                res();
            });
        });
    }
    unloadResource() {
        throw new Error("Method not implemented.");
    }
    redraw(ctx, timestamp) {
        if (MobileController.touchEvents.length === 0)
            this.updateTouchEvents();
        if (this.image) {
            ctx.drawImage(this.image, 0, Canvas.height - 160);
        }
    }
    redrawDbg(ctx, timestamp) {
        for (let e of MobileController.touchEvents) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    }
    updateTouchEvents() {
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));
        this.addTouchHandler(this.dpadX, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));
    }
    static resetController() {
        this.touchEvents = [];
    }
    addTouchHandler(x, y, w, h, callback) {
        MobileController.touchEvents.push({
            x: x,
            y: y,
            width: w,
            height: h,
            callback: callback
        });
    }
    dpadUp() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
    }
    dpadDown() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));
    }
    dpadLeft() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    }
    dpadRight() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    }
}
MobileController.touchEvents = [];
//# sourceMappingURL=MobileController.js.map