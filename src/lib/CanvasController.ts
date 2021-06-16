import { SimpleMap, World } from "./Map.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { PlayerEntity } from "./Sprite.js";

let mouseStartX: number | null = null;
let mouseStartY: number | null = null;

export default class Canvas implements Drawable {

    static canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    // private map!: MapData;
    private world!: World;

    // private lastFrame: number;

    constructor(qSel: string = "canvas#game") {
        let c = document.querySelector(qSel);
        if (isValidCanvasElement(c)) {
            Canvas.canvas = c;
            this.ctx = Canvas.canvas.getContext("2d")!;
        } else {
            throw qSel + " is not a valid Canvas Query String";
        }

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "o":
                    // this.map.toggleObjectsRendering();
                    let p = prompt("Level?");
                    if (p !== null && p !== "") {
                        this.changeWorld(p);
                    };
                    break;

                case "Shift":
                    this.world.startRunning();
                    break;

                case "ArrowLeft":
                    // this.map.decreaseAreaX();
                    ObjectRegistry.world.moveLeft();
                    break;

                case "ArrowRight":
                    // this.map.increaseAreaX();
                    // this.world.incX();
                    ObjectRegistry.world.moveRight();
                    break;

                case "ArrowUp":
                    // this.map.decreaseAreaY();
                    // this.world.decY();
                    ObjectRegistry.world.moveUp();
                    break;

                case "ArrowDown":
                    // this.map.increaseAreaY();
                    // this.world.incY();
                    ObjectRegistry.world.moveDown();
                    break;

                case "Enter":
                    this.world.tp();
                    break;
            }
        });

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "Shift":
                    this.world.stopRunning();
                    break;
            }
        });

        window.addEventListener("mousedown", (event) => {
            mouseStartX = event.clientX;
            mouseStartY = event.clientY;
        });

        window.addEventListener("mousemove", (event) => {
            if (mouseStartX !== null && mouseStartY !== null) {
                let diffX = event.clientX - mouseStartX;
                let diffY = event.clientY - mouseStartY;
                // this.map.setCurrentAreaX(diffX / 320);
                // this.map.setCurrentAreaY(diffY / 320);
                ObjectRegistry.world.setOffset(diffX / 10, diffY / 10);
                console.log(diffX, diffY);
            }

        });

        window.addEventListener("mouseup", (event) => {
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

        let s = await SimpleMap.build("level0.json", this);
        ObjectRegistry.addToRenderQueue(s);

        let player = new PlayerEntity(0, 0);
        ObjectRegistry.addToMap(player);

        let player1 = new PlayerEntity(2, 2);
        ObjectRegistry.addToMap(player1);
        // ObjectRegistry.addToRenderQueue(await World.loadMap("level0.json", this));
        // debugger;

        ObjectRegistry.resolveAllSprites();
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

    /**
     * 
     * @deprecated
     */
    async loadStuff(levelname: string) {
        // this.map = await MapData.loadMap("level1.json", this);
        this.world = await World.loadMap(levelname, this);
        Promise.all([
            // this.map.resolveSprites()
            this.world.resolveSprites()
        ]).then(e => {
            //loading has finished, start the game
            this.startGame();
        });
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

    /**
     * 
     * @deprecated
     */
    public changeWorld(level: string) {
        this.world.unloadWorld();
        this.loadStuff(level);
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

