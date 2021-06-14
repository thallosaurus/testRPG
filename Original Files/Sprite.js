var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RequestedFile from '../lib/RequestedFile.js';
import { Controllers } from '../lib/Controllers.js';
export var Sprites;
(function (Sprites) {
    function fileHasLoaded(elem) {
        return elem instanceof HTMLImageElement;
    }
    class SpriteMap extends RequestedFile {
        constructor(filename, config = {
            tileHeight: 32,
            tileWidth: 32
        }) {
            super();
            this.filename = filename;
            this.tileHeight = config.tileHeight;
            this.tileWidth = config.tileWidth;
        }
        getFileName() {
            return this.filename;
        }
        loadSprite() {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                let sm = (yield RequestedFile.load("assets/sprites/" + this.filename));
                this.spriteMapUrl = URL.createObjectURL(sm);
                this.spriteMap = new Image();
                this.spriteMap.src = this.spriteMapUrl;
                res();
            }));
        }
        unloadSprite() {
            if (this.spriteMapUrl === null) {
                throw new Error("Can not unload sprite that isn't loaded");
            }
            URL.revokeObjectURL(this.spriteMapUrl);
            this.spriteMapUrl = null;
        }
        getImage() {
            return this.spriteMap;
        }
    }
    SpriteMap.NORMAL_SPEED = 250;
    SpriteMap.FAST_SPEED = 100;
    Sprites.SpriteMap = SpriteMap;
    class OneTwoThree extends SpriteMap {
        constructor(offset = 0) {
            super("onetwothree.png");
            this.current = offset % 4;
        }
        onDraw(ctx) {
            if (fileHasLoaded(this.getImage())) {
                ctx.drawImage(this.getImage(), this.current * this.tileWidth, 0, this.tileWidth, this.tileHeight, 0, 0, this.tileWidth, this.tileHeight);
            }
            else
                console.warn(this.getFileName() + " Is not loaded yet");
        }
        flip(num) {
            this.current = num % 4;
        }
        increase() {
            let g = this.current + 1;
            this.current = g % 4;
        }
    }
    Sprites.OneTwoThree = OneTwoThree;
    let Player;
    (function (Player) {
        let Direction;
        (function (Direction) {
            Direction[Direction["DOWN"] = 0] = "DOWN";
            Direction[Direction["LEFT"] = 1] = "LEFT";
            Direction[Direction["RIGHT"] = 2] = "RIGHT";
            Direction[Direction["UP"] = 3] = "UP";
        })(Direction = Player.Direction || (Player.Direction = {}));
        class PlayerSprite extends SpriteMap {
            constructor() {
                super("player.png", {
                    tileHeight: 64,
                    tileWidth: 64
                });
                this.current = 0;
                this.aTimestamp = null;
                this.direction = Direction.DOWN;
            }
            onDraw(ctx) {
                if (fileHasLoaded(this.getImage())) {
                    ctx.drawImage(this.getImage(), (this.getCurrentFrame()) * this.tileWidth, this.direction * this.tileHeight, this.tileWidth, this.tileHeight, (Controllers.CanvasController.canvas.width / 2) - (this.tileWidth / 2), (Controllers.CanvasController.canvas.height / 2) - (this.tileHeight / 2), this.tileWidth, this.tileHeight);
                }
            }
            getCurrentFrame() {
                if (this.aTimestamp !== null) {
                    return ~~((this.rTimestamp - this.aTimestamp) / ((this.running ? SpriteMap.FAST_SPEED : SpriteMap.NORMAL_SPEED))) % 4;
                }
                else {
                    return 0;
                }
            }
            setDirection(dir) {
                console.log("setting direction " + dir);
                this.direction = dir;
            }
            advanceAnimation() {
                let g = this.current;
                g++;
                this.current = g % 4;
            }
            resetAnimation() {
                this.aTimestamp = this.rTimestamp;
            }
            disableAnimation() {
                this.aTimestamp = null;
            }
            enableAnimation() {
                this.resetAnimation();
            }
            isAnimating() {
                return this.aTimestamp !== null;
            }
            startRunning() {
                this.running = true;
            }
            stopRunning() {
                this.running = false;
            }
            isRunning() {
                return this.running === true;
            }
        }
        Player.PlayerSprite = PlayerSprite;
    })(Player = Sprites.Player || (Sprites.Player = {}));
    class ClearScreen {
        constructor(canvas) {
            this.canvas = canvas;
        }
        onDraw(ctx) {
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    Sprites.ClearScreen = ClearScreen;
})(Sprites || (Sprites = {}));
//# sourceMappingURL=Sprite.js.map