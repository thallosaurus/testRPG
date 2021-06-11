import { Sprites } from '../sprites/Sprite.js';
import { Map } from '../map/Map.js';

export namespace Controllers {

    function isCanvasElement(elem: HTMLCanvasElement | null): elem is HTMLCanvasElement {
        if (!elem) {
            return false;
        }

        return (elem.tagName === 'CANVAS');
    }

    export class CanvasController {

        public static canvas: HTMLCanvasElement;
        private readonly context: CanvasRenderingContext2D;
        private readonly clearScreenSprite: Sprites.ClearScreen;

        public static currentFrames: number = 0;

        private s!: Sprites.Player.PlayerSprite;
        private map!: Map.Map;

        get canvas() {
            return CanvasController.canvas;
        }

        set canvas(c: HTMLCanvasElement) {
            CanvasController.canvas = c;
        }

        constructor(qSel: string = "canvas#game") {
            //get HTMLCanvasElement
            let c = <HTMLCanvasElement>document.querySelector(qSel)!;

            //Checks, if the element is a canvas element, if not throw an error
            if (!isCanvasElement(c)) {
                throw new Error(`Element ${qSel} does not exist or is not a canvas element`);
            }

            //we are sure the element is a canvas element, assign it
            this.canvas = c;
            this.context = this.canvas.getContext("2d")!;

            this.clearScreenSprite = new Sprites.ClearScreen(this.canvas);

            this.addTestSprite();

            window.addEventListener("keydown", this.keyDownHandler.bind(this));
            window.addEventListener("keyup", this.keyUpHandler.bind(this));

            //call requestAnimationFrame to let the canvas redraw
            requestAnimationFrame(this.draw.bind(this));
        }

        private async addTestSprite() {
            //test fetch
            this.s = new Sprites.Player.PlayerSprite();
            await this.s.loadSprite();
            console.log(this.s);

            this.map = new Map.Map();
            

            /*             setInterval(() => {
                            this.s.advanceAnimation();
                        }, 250); */
        }

        private draw(ts: number) {
            // console.log(ts);
            CanvasController.currentFrames = ts;
            this.clearScreenSprite.onDraw(this.context);
            this.s.onDraw(this.context);
            requestAnimationFrame(this.draw.bind(this));
        }

        private keyDownHandler(event: KeyboardEvent) {
            console.log("Down", event);

            switch (event.key) {
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    if (!this.s.isAnimating()) this.s.enableAnimation();
                    this.arrowKeyHandler(event);
                    break;
                case "Shift":
                    if (!this.s.isRunning()) this.s.startRunning();
            }
        }

        private arrowKeyHandler(event: KeyboardEvent) {
            switch (event.key) {
                case "ArrowUp":
                    this.s.setDirection(Sprites.Player.Direction.UP);
                    break;
                case "ArrowDown":
                    this.s.setDirection(Sprites.Player.Direction.DOWN);
                    break;
                case "ArrowLeft":
                    this.s.setDirection(Sprites.Player.Direction.LEFT);
                    break;
                case "ArrowRight":
                    this.s.setDirection(Sprites.Player.Direction.RIGHT);
                    break;
            }
        }

        private keyUpHandler(event: KeyboardEvent) {
            console.log("Up", event);
            switch (event.key) {
                case "Shift":
                    if (this.s.isRunning()) this.s.stopRunning();
                    break;
                default:
                    this.s.disableAnimation();
            }
        }
    }

}