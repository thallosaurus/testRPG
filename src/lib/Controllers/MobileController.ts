// import { Z_ASCII } from "zlib";
import { Drawable } from "../Interfaces/Drawable";
import { InputHandler } from "../Interfaces/InputHandler";
import { ImageLoader } from "../Interfaces/ResourceLoader";
import { AudioController } from "./AudioController";
import Canvas from "./CanvasController";

export class MobileController implements Drawable, ImageLoader, InputHandler {
    // private touches: Array<StoredTouchEvent> = [];
    private touchesObj: any = {};
    onKeyboardEvent(e: KeyboardEvent): void {
        // throw new Error("Method not implemented.");
    }

    onTouchEvent(e: TouchEvent): void {
        //deprecated
    }

    onTouchStartEvent(e: TouchEvent) {
        console.log("Touchstart");
        // alert(e.touches.length);
        for (let to of e.changedTouches) {
            this.touchesObj[to.identifier] = {
                x: to.clientX,
                y: to.clientY,
                fingerindex: to.identifier
            };
        }
        console.log(this.touchesObj);
    }

    onTouchEndEvent(e: TouchEvent) {
        console.log("Touchend");
        for (let t of e.changedTouches) {
            delete this.touchesObj[t.identifier];
        }
        console.log(e);
    }

    onTouchMoveEvent(e: TouchEvent) {
        console.log("Touchmove");
        for (let t of e.changedTouches) {
            console.log(t.identifier);
            this.touchesObj[t.identifier].x = t.clientX;
            this.touchesObj[t.identifier].y = t.clientY;
        }
        console.log(e);
    }

    constructor() {
        this.updateTouchEvents();
    }

    private imageUrl: string | null = null;
    private image: HTMLImageElement | null = null;
    private buttonsImageUrl: string | null = null;
    private buttonsImage: HTMLImageElement | null = null;
    private unmuteImageUrl: string | null = null;
    private unmuteImage: HTMLImageElement | null = null;

    static touchEvents: Array<TouchEventDpad> = [];

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

    get buttonWidth() {
        return 80;
    }

    get buttonHeight() {
        return 80;
    }

    get unmuteButtonWidth() {
        return 48;
    }

    get unmuteButtonHeight() {
        return 48;
    }

    get safeAreaLeft() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sal"));
    }

    get safeAreaRight() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sar"));
    }
    get safeAreaBottom() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
    }
    get safeAreaTop() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat"));
    }

    resolveResource(): Promise<void> {
        return new Promise<void>((res, rej) => {
            fetch("/assets/controls/dpad.png")
                .then(f => {
                    return f.blob();
                }).then(blob => {
                    this.imageUrl = URL.createObjectURL(blob);
                    this.image = new Image();
                    this.image.src = this.imageUrl;
                });

            fetch("/assets/controls/unmute.png")
                .then(f => {
                    return f.blob();
                })
                .then(blob => {
                    this.unmuteImageUrl = URL.createObjectURL(blob);
                    this.unmuteImage = new Image();
                    this.unmuteImage.src = this.unmuteImageUrl;
                })

            fetch("/assets/controls/a-button.png")
                .then((e) => {
                    return e.blob();
                }).then(blob => {
                    this.buttonsImageUrl = URL.createObjectURL(blob);
                    this.buttonsImage = new Image();
                    this.buttonsImage.src = this.buttonsImageUrl;
                    res();
                });
        })
    }
    unloadResource(): void {
        throw new Error("Method not implemented.");
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        if (MobileController.touchEvents.length === 0) this.updateTouchEvents();
        if (this.image) {
            ctx.drawImage(this.image, this.safeAreaLeft, Canvas.height - 160 - this.safeAreaBottom);
        }

        if (this.buttonsImage) {
            ctx.drawImage(this.buttonsImage, Canvas.width - this.safeAreaRight - this.buttonWidth, Canvas.height - this.safeAreaBottom - 125, this.buttonWidth, this.buttonHeight);
        }

        if (this.unmuteImage && !AudioController.audioCtx && Canvas.DEBUG) {
            ctx.drawImage(this.unmuteImage, Canvas.width / 2 - 24, this.safeAreaTop, this.unmuteButtonWidth, this.unmuteButtonHeight);
        }

        //check touches and run them
        for (let touch in this.touchesObj) {
            this.getTouchHandler(this.touchesObj[touch].x, this.touchesObj[touch].y)?.callback();
        }
    }

    redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number) {
        for (let e of MobileController.touchEvents) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }

        for (let t in this.touchesObj) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "purple";
            ctx.beginPath();
            // ctx.fillRect(t.x, t.y, 50, 50);
            ctx.arc(this.touchesObj[t].x, this.touchesObj[t].y, 20, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.stroke();
        }

        let i = 0;
        for (let t in this.touchesObj) {
            let size = 36;
            ctx.fillStyle = "green";
            ctx.textBaseline = "top";
            ctx.font = size + "px Arial";
            ctx.fillText(`${i}: ${this.touchesObj[t].x}, ${this.touchesObj[t].y}; ${this.touchesObj[t].fingerindex}`, 0, size * i);
            i++;
        }
    }

    public updateTouchEvents() {
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3, this.dpadY - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));    //up
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));    //down
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));    //right
        this.addTouchHandler(this.safeAreaLeft + this.dpadX, this.dpadY + this.dpadHeight / 3 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));    //left

        this.addTouchHandler(Canvas.width - this.safeAreaRight - this.buttonWidth, Canvas.height - this.safeAreaBottom - 125, this.buttonWidth, this.buttonHeight, this.aButton.bind(this));
        Canvas.DEBUG && this.addTouchHandler(Canvas.width / 2 - 24, this.safeAreaTop, this.unmuteButtonWidth, this.unmuteButtonHeight, () => AudioController.activateAudioContext());
    }

    static resetController() {
        this.touchEvents = [];
    }

    private addTouchHandler(x: number, y: number, w: number, h: number, callback: () => void) {
        MobileController.touchEvents.push({
            x: x,
            y: y,
            width: w,
            height: h,
            callback: callback
        });
    }

    private getTouchHandler(x: number, y: number) : TouchEventDpad | undefined {
        let c = MobileController.touchEvents.filter(t => {
            return (
                x > t.x 
                && y > t.y
                && x < t.x + t.width
                && y < t.y + t.height
            );
        });

        return c[0];
    }

    private dpadUp() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
    }

    private dpadDown() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));
    }

    private dpadLeft() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    }

    private dpadRight() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    }

    private aButton() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
    }

    private bButton() {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))

    }
}

interface TouchEventDpad {
    x: number;
    y: number;
    width: number;
    height: number;
    callback(): void;
}

interface StoredTouchEvent {
    x: number;
    y: number;
    fingerindex: number;
}