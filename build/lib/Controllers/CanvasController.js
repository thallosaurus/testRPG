var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectRegistry } from "../ObjectRegistry";
import { AnimationController } from "./AnimationController";
import { MobileController } from "./MobileController";
import { WorldController } from "./WorldController";
let mouseStartX = null;
let mouseStartY = null;
export default class Canvas {
    constructor(qSel = "canvas#game") {
        this.lastFrame = 0;
        this.isMoving = false;
        this.direction = -1;
        let c = document.querySelector(qSel);
        if (isValidCanvasElement(c)) {
            Canvas.canvas = c;
            Canvas.canvas.oncontextmenu = function (event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            };
            this.ctx = Canvas.canvas.getContext("2d");
            window.onresize = () => {
                this.updateCanvasSize();
            };
            window.onorientationchange = () => {
                this.updateCanvasSize();
                MobileController.resetController();
            };
            Canvas.canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
                return false;
            });
            this.updateCanvasSize();
            this.ctx.imageSmoothingEnabled = false;
        }
        else {
            throw qSel + " is not a valid Canvas Query String";
        }
        window.addEventListener("keydown", ObjectRegistry.onInputEvent.bind(ObjectRegistry));
        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "Shift":
                    break;
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                    this.isMoving = false;
                    break;
            }
        });
        Canvas.DEBUG && window.addEventListener("mousedown", (event) => {
            mouseStartX = event.clientX;
            mouseStartY = event.clientY;
        });
        window.addEventListener("touchstart", (event) => { ObjectRegistry.onTouchEvent(event); });
        Canvas.DEBUG && window.addEventListener("mousemove", (event) => {
            if (mouseStartX !== null && mouseStartY !== null) {
                let diffX = event.clientX - mouseStartX;
                let diffY = event.clientY - mouseStartY;
                ObjectRegistry.setVisualOffset(diffX, diffY);
            }
        });
        Canvas.DEBUG && window.addEventListener("mouseup", (event) => {
            mouseStartX = null;
            mouseStartY = null;
        });
        this.addObjectsToRenderQueue();
        this.startGame();
    }
    static get deltaTime() {
        return this.dTime;
    }
    static get targetFPS() {
        return 30;
    }
    static get minimalRedrawTime() {
        return (1000 / 60) * (60 / this.targetFPS) - (1000 / 60) * 0.5;
    }
    static movePlayer() {
    }
    static get width() {
        return Canvas.canvas.width;
    }
    static get height() {
        return Canvas.canvas.height;
    }
    updateCanvasSize() {
        Canvas.canvas.setAttribute("width", window.innerWidth + "px");
        Canvas.canvas.setAttribute("height", window.innerHeight + "px");
    }
    addObjectsToRenderQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            ObjectRegistry.addToRenderQueue(this);
            let animationController = new AnimationController();
            ObjectRegistry.addToRenderQueue(animationController);
            let worldcontroller = new WorldController();
            ObjectRegistry.addToRenderQueue(worldcontroller);
            let mobileInput = new MobileController();
            if (isPhone())
                ObjectRegistry.addToRenderQueue(mobileInput);
            ObjectRegistry.resolveAllSprites();
        });
    }
    getCanvasWidthTilesAvailable() {
        return Math.floor(Canvas.canvas.width / 64);
    }
    getCanvasHeightTilesAvailable() {
        return Math.floor(Canvas.canvas.height / 64);
    }
    startGame() {
        return requestAnimationFrame(this.draw.bind(this));
    }
    redraw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    }
    draw(ts) {
        Canvas.timestamp = ts;
        Canvas.dTime = ts - this.lastFrame;
        if (ts - this.lastFrame < Canvas.minimalRedrawTime) {
            requestAnimationFrame(this.draw.bind(this));
            return;
        }
        this.lastFrame = ts;
        ObjectRegistry.renderToContext(this.ctx, ts);
        requestAnimationFrame(this.draw.bind(this));
    }
}
Canvas.DEBUG = false;
Canvas.dTime = 0;
function isValidCanvasElement(canvas) {
    if ((canvas === null || canvas === void 0 ? void 0 : canvas.tagName) === "CANVAS") {
        return true;
    }
    return false;
}
function isPhone() {
    return navigator.userAgent.toLowerCase().match(/mobile/i);
}
//# sourceMappingURL=CanvasController.js.map