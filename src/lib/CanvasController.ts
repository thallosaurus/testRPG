import { AnimationController } from "./AnimationController.js";
import { BlackoutAnimation } from "./BlackoutAnimation.js";
import { SimpleMap } from "./Map.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { PlayerEntity, SimplePlayer } from "./Sprite.js";


let mouseStartX: number | null = null;
let mouseStartY: number | null = null;

export default class Canvas implements Drawable {

    static canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    // private map!: MapData;
    // private world!: World;

    // private lastFrame: number;

    public isMoving = false;

    constructor(qSel: string = "canvas#game") {
        let c = document.querySelector(qSel);
        if (isValidCanvasElement(c)) {
            Canvas.canvas = c;
            this.ctx = Canvas.canvas.getContext("2d")!;
            this.ctx.imageSmoothingEnabled = false;
        } else {
            throw qSel + " is not a valid Canvas Query String";
        }

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "o":
                    let g = prompt("Level?");
                    (g !== "" && g !== null) && ObjectRegistry.goToLevel(g);
                    break;
                case "Shift":
                    // this.world.startRunning();
                    break;

                case "ArrowLeft":
                    // this.map.decreaseAreaX();
                    // ObjectRegistry.world.moveLeft();
                    // AnimationController.mapMoveLeft();
                    this.isMoving = true;
                    ObjectRegistry.player.moveLeft();
                    break;

                case "ArrowRight":
                    // this.map.increaseAreaX();
                    // this.world.incX();
                    // ObjectRegistry.world.moveRight();
                    // AnimationController.mapMoveRight();
                    ObjectRegistry.player.moveRight();
                    break;

                case "ArrowUp":
                    // this.map.decreaseAreaY();
                    // this.world.decY();
                    // ObjectRegistry.world.moveUp();
                    // AnimationController.mapMoveUp();
                    ObjectRegistry.player.moveUp();
                    break;

                case "ArrowDown":
                    // this.map.increaseAreaY();
                    // this.world.incY();
                    // ObjectRegistry.world.moveDown();
                    // AnimationController.mapMoveDown();
                    ObjectRegistry.player.moveDown();
                    break;

                case "Enter":
                    // this.world.tp();
                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "Shift":
                    // this.world.stopRunning();
                    break;

                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                    this.isMoving = false;
                    break;
            }
        });

        ObjectRegistry.DEBUG && window.addEventListener("mousedown", (event) => {
            mouseStartX = event.clientX;
            mouseStartY = event.clientY;
        });

        ObjectRegistry.DEBUG && window.addEventListener("mousemove", (event) => {
            if (mouseStartX !== null && mouseStartY !== null) {
                let diffX = event.clientX - mouseStartX;
                let diffY = event.clientY - mouseStartY;
                ObjectRegistry.world.setOffset(diffX / 10, diffY / 10);
                console.log(diffX, diffY);
            }

        });

        ObjectRegistry.DEBUG && window.addEventListener("mouseup", (event) => {
            mouseStartX = null;
            mouseStartY = null;
        });

        // this.loadStuff("level2.json");

        this.addObjectsToRenderQueue();

        // this.loadStuff();
        this.startGame();
    }

    static get width() {
        return Canvas.canvas.width;
    }

    static get height() {
        return Canvas.canvas.height;
    }

    private async addObjectsToRenderQueue() {
        // let world = await World.loadMap("level2.json", this);
        // console.log(world);
        // ObjectRegistry.addToRenderQueue(world);

        ObjectRegistry.addToRenderQueue(this);

        let s = await SimpleMap.build("level0.json");
        ObjectRegistry.addToRenderQueue(s);

        let npc1 = new PlayerEntity(0, 0);
        ObjectRegistry.addToMap(npc1);

        let npc2 = new PlayerEntity(2, 2);
        ObjectRegistry.addToMap(npc2);

        let blackout = new BlackoutAnimation();
        ObjectRegistry.addToRenderQueue(blackout);

        ObjectRegistry.resolveAllSprites();

        AnimationController.hideBlackoutAnimation();
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
        ObjectRegistry.renderToContext(this.ctx, ts);
        requestAnimationFrame(this.draw.bind(this));
    }
}

export interface Drawable {
    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void;
    redrawDbg?(ctx: CanvasRenderingContext2D, timestamp: number): void;
    /*     textureUrl: string;
        texture: HTMLImageElement; */
}

function isValidCanvasElement(canvas: Element | null): canvas is HTMLCanvasElement {
    if (canvas?.tagName === "CANVAS") {
        return true;
    }

    return false;
}