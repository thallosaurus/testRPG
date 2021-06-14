import MapData, { World } from "./Map.js";

let mouseStartX: number | null = null;
let mouseStartY: number | null = null;

export default class Canvas implements Drawable {

    private readonly canvas!: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private map!: MapData;
    private world!: World;

    constructor(qSel: string = "canvas#game") {
        let c = document.querySelector(qSel);
        if (isValidCanvasElement(c)) {
            this.canvas = c;
            this.ctx = this.canvas.getContext("2d")!;
        } else {
            throw qSel + " is not a valid Canvas Query String";
        }

        window.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "o":
                    // this.map.toggleObjectsRendering();
                    break;

                case "ArrowLeft":
                    // this.map.decreaseAreaX();
                    this.world.decX();
                    break;

                case "ArrowRight":
                    // this.map.increaseAreaX();
                    this.world.incX();
                    break;

                case "ArrowUp":
                    // this.map.decreaseAreaY();
                    break;

                case "ArrowDown":
                    // this.map.increaseAreaY();
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
                console.log(diffX, diffY);
            }

        });

        window.addEventListener("mouseup", (event) => {
            mouseStartX = null;
            mouseStartY = null;
        });

        this.loadStuff();
    }

    public getCanvasWidthTilesAvailable() {
        return Math.floor(this.canvas.width / 64);
    }

    public getCanvasHeightTilesAvailable() {
        return Math.floor(this.canvas.height / 64);
    }

    async loadStuff() {
        // this.map = await MapData.loadMap("level1.json", this);
        this.world = await World.loadMap("level0.json", this);
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
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private draw(ts: number) {

        //repaint background
        this.redraw(this.ctx);
        // this.map.redraw(this.ctx);
        this.world.redraw(this.ctx);
        requestAnimationFrame(this.draw.bind(this));
    }
}

export interface Drawable {
    redraw(ctx: CanvasRenderingContext2D): void;
}

function isValidCanvasElement(canvas: Element | null): canvas is HTMLCanvasElement {
    if (canvas?.tagName === "CANVAS") {
        return true;
    }

    return false;
}