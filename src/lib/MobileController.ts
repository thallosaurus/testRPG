import Canvas, { Drawable } from "./CanvasController.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { ResourceLoader } from "./ResourceLoader.js";

export class MobileController implements Drawable, ResourceLoader {

    textureUrl!: string;
    texture!: HTMLImageElement;

    touchEvents: Array<TouchEventDpad> = [];

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

    constructor() {
        window.addEventListener("touchstart", (event) => {
            // if (event.clientX)
            // console.log(event);
            // alert("touch");

            for (let t of event.changedTouches) {
                if (t.clientX < 160 && t.clientY > Canvas.height - 160) {
                    this.processTouchOnDpad(event);
                }
            }
        });

        window.addEventListener("mousedown", (event) => {
            // alert("touch");

            // alert(event.clientX + " " + event.clientY);

            // for (let t of event) {
                if (event.clientX < 160 && event.clientY > Canvas.height - 160) {
                    this.processClickOnDpad(event);
                }
            // }
        });
        this.updateTouchEvents();
    }

    public updateTouchEvents() {
        this.touchEvents = [];

        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));    //up
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));    //down
        this.addTouchHandler(this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));    //right
        this.addTouchHandler(this.dpadX, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));    //left
    }

    processClickOnDpad(touch: MouseEvent) {
        // for (let touch of event.touches) {
            for (let i of this.touchEvents) {
                if (i.x < touch.clientX && i.y < touch.clientY && touch.clientX < i.x + i.width && touch.clientY < i.y + i.height) {
                    // alert("touch");
                    // this.vibrate();
                    i.callback();
                }
            // }
        }
    }

    processTouchOnDpad(event: TouchEvent) {
        for (let touch of event.touches) {
            for (let i of this.touchEvents) {
                if (i.x < touch.clientX && i.y < touch.clientY && touch.clientX < i.x + i.width && touch.clientY < i.y + i.height) {
                    // alert("touch");
                    // this.vibrate();
                    i.callback();
                }
            }
        }
    }

    private addTouchHandler(x: number, y: number, w: number, h: number, callback: () => void) {
        this.touchEvents.push({
            x: x,
            y: y,
            width: w,
            height: h,
            callback: callback
        });
    }

    vibrate() {
        if (window.navigator.vibrate) {
            window.navigator.vibrate?.(200);
        }
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        // ctx.fillStyle = "red";
        // ctx.fillRect(0, 0, 100, 100);

        //draw D-Pad in bottom left corner:
        // console.log(this.texture);
        if (this.texture) ctx.drawImage(this.texture, 0, Canvas.height - 160);
    }

    redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number) {
        // console.log("dbg");
        for (let e of this.touchEvents) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    }

    resolveSprites(): Promise<void> {
        return new Promise((res, rej) => {
            return fetch("/assets/controls/dpad.png").then(e => {
                return e.blob();
            }).then(blob => {
                let img = new Image();
                this.textureUrl = URL.createObjectURL(blob);
                img.src = this.textureUrl;
                this.texture = img;
                res();
            });
        });
    }

    private dpadUp() {
        // console.log("up");
        ObjectRegistry.player.moveUp();
    }

    private dpadDown() {
        // console.log("down");
        ObjectRegistry.player.moveDown();
    }

    private dpadLeft() {
        // alert("left");
        ObjectRegistry.player.moveLeft();
    }

    private dpadRight() {
        // console.log("right");
        ObjectRegistry.player.moveRight();
    }
}

interface TouchEventDpad {
    x: number;
    y: number;
    width: number;
    height: number;
    callback(): void;
}