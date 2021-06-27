// import { Z_ASCII } from "zlib";
import { Drawable } from "../Interfaces/Drawable";
import { InputHandler } from "../Interfaces/InputHandler";
import { ImageLoader } from "../Interfaces/ResourceLoader";
import { AudioController } from "./AudioController";
import Canvas from "./CanvasController";

export class MobileController implements Drawable, ImageLoader, InputHandler {
    onKeyboardEvent(e: KeyboardEvent): Promise<void> {
        throw new Error("Method not implemented.");
    }

    onTouchEvent(e: TouchEvent): void {
        // console.log(e);
        let c = MobileController.touchEvents.filter(t => {
            return (e.changedTouches[0].clientX > t.x && e.changedTouches[0].clientY > t.y && e.changedTouches[0].clientX < t.x + t.width && e.changedTouches[0].clientY < t.y + t.height);
        });

        // console.log(c);
        // alert("touch");
        if (c.length === 1) {
            c[0].callback();
        }
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
            ctx.drawImage(this.buttonsImage, Canvas.width - this.safeAreaRight - 75, Canvas.height - this.safeAreaBottom - 150, 60, 60);
        }

        if (this.unmuteImage && !AudioController.audioCtx) {
            ctx.drawImage(this.unmuteImage, Canvas.width / 2 - 30, this.safeAreaTop, 60, 60);
        }
    }

    redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number) {
        for (let e of MobileController.touchEvents) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    }

    public updateTouchEvents() {
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3, this.dpadY - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));    //up
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));    //down
        this.addTouchHandler(this.safeAreaLeft + this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));    //right
        this.addTouchHandler(this.safeAreaLeft + this.dpadX, this.dpadY + this.dpadHeight / 3 - this.safeAreaBottom, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));    //left

        this.addTouchHandler(Canvas.width - this.safeAreaRight - 75, Canvas.height - this.safeAreaBottom - 150, 60, 60, this.aButton.bind(this));
        this.addTouchHandler(Canvas.width / 2 - 30, this.safeAreaTop, 60, 60, () => AudioController.activateAudioContext());
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
}

interface TouchEventDpad {
    x: number;
    y: number;
    width: number;
    height: number;
    callback(): void;
}