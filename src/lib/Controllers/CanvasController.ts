import { Drawable } from "../Interfaces/Drawable";
import { ObjectRegistry } from "../ObjectRegistry";
import { MapUtils } from "../Utilities";
import { AnimationController } from "./AnimationController";
import { HUDController } from "./HUDController";
import { MobileController } from "./MobileController";
import { WorldController } from "./WorldController";


let mouseStartX: number | null = null;
let mouseStartY: number | null = null;

export default class Canvas implements Drawable {
    
    static canvas: HTMLCanvasElement;
    static readonly DEBUG: boolean = MapUtils.getFromURL("debug") == "1" ?? false;

    private readonly ctx: CanvasRenderingContext2D;

    private lastFrame: number = 0;

    public isMoving = false;
    public direction = -1;

    static dTime = 0;
    static timestamp: number;
    static get deltaTime() {
        return this.dTime;
    }

    static get targetFPS() {
        return 30;
    }

    static get minimalRedrawTime() {
        return (1000/60) * (60 / this.targetFPS) -(1000/60) * 0.5;
    }

    constructor(qSel: string = "canvas#game") {
        let c = document.querySelector(qSel);
        if (isValidCanvasElement(c)) {
            Canvas.canvas = c;
            Canvas.canvas.oncontextmenu = function(event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
           };
            this.ctx = Canvas.canvas.getContext("2d")!;

            window.onresize = () => {
                this.updateCanvasSize();
            }

            window.onorientationchange = () => {
                // alert("ok");
                this.updateCanvasSize();
                // ObjectRegistry.mobileController?.updateTouchEvents();
                MobileController.resetController();
            };

            Canvas.canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
                return false;
            })
            this.updateCanvasSize();

            this.ctx.imageSmoothingEnabled = false;
        } else {
            throw qSel + " is not a valid Canvas Query String";
        }

        window.addEventListener("touchstart", (event) => {ObjectRegistry.onTouchStartEvent(event)});
        window.addEventListener("touchmove", (event) => {ObjectRegistry.onTouchMoveEvent(event)});
        window.addEventListener("touchend", (event) => {ObjectRegistry.onTouchEndEvent(event)});

        window.addEventListener("keydown", ObjectRegistry.onInputEvent.bind(ObjectRegistry));

         Canvas.DEBUG && window.addEventListener("mousedown", (event) => {
            mouseStartX = event.clientX;
            mouseStartY = event.clientY;
        });


        Canvas.DEBUG && window.addEventListener("mousemove", (event) => {
            if (mouseStartX !== null && mouseStartY !== null) {
                let diffX = event.clientX - mouseStartX;
                let diffY = event.clientY - mouseStartY;
                // ObjectRegistry.world.setOffset(diffX / 10, diffY / 10);
                ObjectRegistry.setVisualOffset(diffX, diffY);

                // console.log(diffX, diffY);
            }

        });

        Canvas.DEBUG && window.addEventListener("mouseup", (event) => {
            mouseStartX = null;
            mouseStartY = null;
        });

        this.addObjectsToRenderQueue();

        // console.log(Canvas.MINIMAL_REDRAW_TIME);

        // this.loadStuff();
        this.startGame();
    }

    static movePlayer() {
        
    }

    static get width() {
        return Canvas.canvas.width;
    }

    static get height() {
        return Canvas.canvas.height;
    }

    private updateCanvasSize() {
        Canvas.canvas.setAttribute("width", window.innerWidth + "px");
        Canvas.canvas.setAttribute("height", window.innerHeight + "px");
    }

    private async addObjectsToRenderQueue() {
        // let world = await World.loadMap("level2.json", this);
        // console.log(world);
        // ObjectRegistry.addToRenderQueue(world);

        ObjectRegistry.addToRenderQueue(this);

        // let s = await SimpleMap.build("room0.json");
        // ObjectRegistry.addToRenderQueue(s);

        /* 
        let npc1 = new PlayerEntity(0, 0);
        ObjectRegistry.addToMap(npc1);
        
        let npc2 = new PlayerEntity(2, 2);
        ObjectRegistry.addToMap(npc2); */
        
        // let blackout = new BlackoutAnimation();
        // ObjectRegistry.addToRenderQueue(blackout);
        
        
        // let fpsCounter = new FPSCounter();
        // ObjectRegistry.addToRenderQueue(fpsCounter);
        
        let animationController = new AnimationController();
        ObjectRegistry.addToRenderQueue(animationController);
        
        let worldcontroller = new WorldController();
        // let gm = await GameMap.getLevel("room0.json");
        // worldcontroller.loadMap(gm);

        ObjectRegistry.addToRenderQueue(worldcontroller);

        // ObjectRegistry.addToRenderQueue(new HUDController());
        
        let mobileInput = new MobileController();
        if (isPhone()) ObjectRegistry.addToRenderQueue(mobileInput);


        ObjectRegistry.resolveAllSprites();
        
        // AnimationController.hideBlackoutAnimation();
    }

    /**
     * 
     * @deprecated
     */
    public getCanvasWidthTilesAvailable() {
        return Math.floor(Canvas.canvas.width / 64);
    }

    /**
     * @deprecated
     */
    public getCanvasHeightTilesAvailable() {
        return Math.floor(Canvas.canvas.height / 64);
    }

    public startGame(): number {
        return requestAnimationFrame(this.draw.bind(this));
    }

    public redraw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    }

    private draw(ts: number) {
        // let diff = ts - this.lastFrame;
        Canvas.timestamp = ts;
        Canvas.dTime = ts - this.lastFrame;
        if (ts - this.lastFrame < Canvas.minimalRedrawTime) {
            //FRAMESKIP, call was too early
            requestAnimationFrame(this.draw.bind(this));
            return;
        }
        this.lastFrame = ts;
        // if (diff > )
        ObjectRegistry.renderToContext(this.ctx, ts);
        requestAnimationFrame(this.draw.bind(this));
    }
}

function isValidCanvasElement(canvas: Element | null): canvas is HTMLCanvasElement {
    if (canvas?.tagName === "CANVAS") {
        return true;
    }

    return false;
}

export function isPhone() {
    return navigator.userAgent.toLowerCase().match(/mobile/i);
}