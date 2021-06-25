import { Z_ASCII } from "zlib";
import { Drawable } from "../Interfaces/Drawable.js";
import { InputHandler } from "../Interfaces/InputHandler.js";
import { ImageLoader } from "../Interfaces/ResourceLoader.js";
import Canvas from "./CanvasController.js";

export class MobileController implements Drawable, ImageLoader, InputHandler {
    onKeyboardEvent(e: KeyboardEvent): void {
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

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return new Promise<void>((res, rej) => {
            fetch("/assets/controls/dpad.png")
                .then(f => {
                    return f.blob();
                }).then(blob => {
                    this.imageUrl = URL.createObjectURL(blob);
                    this.image = new Image();
                    this.image.src = this.imageUrl;
                    res();
                });
        })
    }
    unloadResource(): void {
        throw new Error("Method not implemented.");
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        // ctx.fillStyle = "red";
        // ctx.fillRect(0, 0, 100, 100);

        //draw D-Pad in bottom left corner:
        // console.log(this.texture);
        if (MobileController.touchEvents.length === 0) this.updateTouchEvents();
        if (this.image) {
            ctx.drawImage(this.image, 0, Canvas.height - 160);
        }
    }

    redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number) {
        // console.log("dbg");
        for (let e of MobileController.touchEvents) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }        // throw new Error("Method not implemented.");
    }

    public updateTouchEvents() {
        // MobileController.touchEvents = [];

        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));    //up
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));    //down
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));    //right
        this.addTouchHandler(this.dpadX, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));    //left
    }

    static resetController() {
        this.touchEvents = [];
    }

    private addTouchHandler(x: number, y: number, w: number, h: number, callback: () => void) {
        // if (MobileController.touchEvents.length == 0) this.updateTouchEvents();
        MobileController.touchEvents.push({
            x: x,
            y: y,
            width: w,
            height: h,
            callback: callback
        });
    }
    private dpadUp() {
        // console.log("up");
        /*         while (this.mouseeventX !== null && this.mouseeventY !== null) {
                    alert("oh");
                } */
        // ObjectRegistry.player.moveUp();
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "w"}));
    }

    private dpadDown() {
        // console.log("down");
        // ObjectRegistry.player.moveDown();
        // alert("down");
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "s"}));
    }
    
    private dpadLeft() {
        // alert("left");
        // ObjectRegistry.player.moveLeft();
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "a"}));
    }
    
    private dpadRight() {
        // console.log("right");
        // ObjectRegistry.player.moveRight();
        window.dispatchEvent(new KeyboardEvent("keydown", {key: "d"}));
    }
}

interface TouchEventDpad {
    x: number;
    y: number;
    width: number;
    height: number;
    callback(): void;
}