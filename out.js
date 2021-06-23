(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationController = void 0;

var _BlackoutAnimation = require("./BlackoutAnimation.js");

var _CanvasController = _interopRequireDefault(require("./CanvasController.js"));

var _ObjectRegistry = require("./ObjectRegistry.js");

var _Sprite = require("./Sprite.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const FRAMES = 60;

class AnimationController {
  static get isMoving() {
    return this.mapMovePromise !== null;
  }

  static mapMoveUp() {
    this.dir = _Sprite.PlayerDirection.UP;
    return this.move();
  }

  static mapMoveDown() {
    this.dir = _Sprite.PlayerDirection.DOWN;
    return this.move();
  }

  static mapMoveLeft() {
    this.dir = _Sprite.PlayerDirection.LEFT;
    return this.move();
  }

  static mapMoveRight() {
    this.dir = _Sprite.PlayerDirection.RIGHT;
    return this.move();
  }

  static move() {
    if (!this.isMoving) {
      this.mapMovePromise = new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        let i = 0;

        while (i !== FRAMES) {
          switch (this.dir) {
            case _Sprite.PlayerDirection.UP:
              _ObjectRegistry.ObjectRegistry.world.setOffset(0, i / FRAMES);

              _ObjectRegistry.ObjectRegistry.player.setOffset(0, i / FRAMES * -1);

              break;

            case _Sprite.PlayerDirection.DOWN:
              _ObjectRegistry.ObjectRegistry.world.setOffset(0, i / FRAMES * -1);

              _ObjectRegistry.ObjectRegistry.player.setOffset(0, i / FRAMES);

              break;

            case _Sprite.PlayerDirection.LEFT:
              _ObjectRegistry.ObjectRegistry.world.setOffset(i / FRAMES, 0);

              _ObjectRegistry.ObjectRegistry.player.setOffset(i / FRAMES * -1, 0);

              break;

            case _Sprite.PlayerDirection.RIGHT:
              _ObjectRegistry.ObjectRegistry.world.setOffset(i / FRAMES * -1, 0);

              _ObjectRegistry.ObjectRegistry.player.setOffset(i / FRAMES, 0);

              break;
          }

          if (i % (FRAMES / 4) === 0) _ObjectRegistry.ObjectRegistry.player.progressWalking();
          yield AnimationController.wait(2);
          i++;
        }

        this.resetOffsets();

        switch (this.dir) {
          case _Sprite.PlayerDirection.UP:
            this.finalizeMoveUp();
            break;

          case _Sprite.PlayerDirection.DOWN:
            this.finalizeMoveDown();
            break;

          case _Sprite.PlayerDirection.LEFT:
            this.finalizeMoveLeft();
            break;

          case _Sprite.PlayerDirection.RIGHT:
            this.finalizeMoveRight();
            break;
        }

        this.mapMovePromise = null;
        res();
      }));
      console.log(this.mapMovePromise);
      return this.mapMovePromise;
    } else {
      return null;
    }
  }

  static resetOffsets() {
    _ObjectRegistry.ObjectRegistry.world.setOffset(0, 0);

    _ObjectRegistry.ObjectRegistry.player.setOffset(0, 0);
  }

  static finalizeMoveRight() {
    _ObjectRegistry.ObjectRegistry.world.posX--;
    _ObjectRegistry.ObjectRegistry.player.x_++;
  }

  static finalizeMoveLeft() {
    _ObjectRegistry.ObjectRegistry.world.posX++;
    _ObjectRegistry.ObjectRegistry.player.x_--;
  }

  static finalizeMoveDown() {
    _ObjectRegistry.ObjectRegistry.world.posY--;
    _ObjectRegistry.ObjectRegistry.player.y_++;
  }

  static finalizeMoveUp() {
    _ObjectRegistry.ObjectRegistry.world.posY++;
    _ObjectRegistry.ObjectRegistry.player.y_--;
  }

  static wait(duration) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(duration, duration / 2);
      return new Promise((res, rej) => {
        setTimeout(res, duration / _CanvasController.default.deltaTime);
      });
    });
  }

  static showBlackoutAnimation() {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
      _ObjectRegistry.ObjectRegistry.player.movementBlocked = true;
      let i = 0;

      while (i < 100) {
        _BlackoutAnimation.BlackoutAnimation.alpha = i;
        yield AnimationController.wait(1);
        i++;
      }

      res();
    }));
  }

  static hideBlackoutAnimation() {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
      let i = 100;

      while (i !== 0) {
        _BlackoutAnimation.BlackoutAnimation.alpha = i;
        yield AnimationController.wait(1);
        i--;
      }

      _ObjectRegistry.ObjectRegistry.player.movementBlocked = false;
      res();
    }));
  }

}

exports.AnimationController = AnimationController;
AnimationController.mapMovePromise = null;
AnimationController.walkingDirAlternate = false;
AnimationController.dir = null;

},{"./BlackoutAnimation.js":2,"./CanvasController.js":3,"./ObjectRegistry.js":7,"./Sprite.js":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlackoutAnimation = void 0;

var _CanvasController = _interopRequireDefault(require("./CanvasController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BlackoutAnimation {
  redraw(ctx, timestamp) {
    ctx.fillStyle = "rgba(0, 0, 0, " + BlackoutAnimation.alpha / 100 + ")";
    ctx.fillRect(0, 0, _CanvasController.default.width, _CanvasController.default.height);
  }

}

exports.BlackoutAnimation = BlackoutAnimation;
BlackoutAnimation.alpha = 100;

},{"./CanvasController.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AnimationController = require("./AnimationController.js");

var _BlackoutAnimation = require("./BlackoutAnimation.js");

var _FpsCounter = require("./FpsCounter.js");

var _Map = require("./Map.js");

var _MobileController = require("./MobileController.js");

var _ObjectRegistry = require("./ObjectRegistry.js");

var _SocketConnection = require("./SocketConnection.js");

var _Sprite = require("./Sprite.js");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

let mouseStartX = null;
let mouseStartY = null;

class Canvas {
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
        var _a;

        this.updateCanvasSize();
        (_a = _ObjectRegistry.ObjectRegistry.mobileController) === null || _a === void 0 ? void 0 : _a.updateTouchEvents();
      };

      Canvas.canvas.addEventListener("contextmenu", event => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      });
      this.updateCanvasSize();
      this.ctx.imageSmoothingEnabled = false;
    } else {
      throw qSel + " is not a valid Canvas Query String";
    }

    window.addEventListener("keydown", e => {
      switch (e.key) {
        case "o":
          let g = prompt("Level?");
          g !== "" && g !== null && _ObjectRegistry.ObjectRegistry.goToLevel(g);
          break;

        case "Shift":
          break;

        case "a":
        case "ArrowLeft":
          this.isMoving = true;
          this.direction = _Sprite.PlayerDirection.LEFT;

          _ObjectRegistry.ObjectRegistry.player.moveLeft();

          break;

        case "d":
        case "ArrowRight":
          this.isMoving = true;
          this.direction = _Sprite.PlayerDirection.RIGHT;

          _ObjectRegistry.ObjectRegistry.player.moveRight();

          break;

        case "w":
        case "ArrowUp":
          this.isMoving = true;
          this.direction = _Sprite.PlayerDirection.UP;

          _ObjectRegistry.ObjectRegistry.player.moveUp();

          break;

        case "s":
        case "ArrowDown":
          this.isMoving = true;
          this.direction = _Sprite.PlayerDirection.DOWN;

          _ObjectRegistry.ObjectRegistry.player.moveDown();

          break;

        case "Enter":
          break;
      }
    });
    window.addEventListener("keyup", e => {
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
    _ObjectRegistry.ObjectRegistry.DEBUG && window.addEventListener("mousedown", event => {
      mouseStartX = event.clientX;
      mouseStartY = event.clientY;
    });
    _ObjectRegistry.ObjectRegistry.DEBUG && window.addEventListener("mousemove", event => {
      if (mouseStartX !== null && mouseStartY !== null) {
        let diffX = event.clientX - mouseStartX;
        let diffY = event.clientY - mouseStartY;

        _ObjectRegistry.ObjectRegistry.world.setOffset(diffX / 10, diffY / 10);

        console.log(diffX, diffY);
      }
    });
    _ObjectRegistry.ObjectRegistry.DEBUG && window.addEventListener("mouseup", event => {
      mouseStartX = null;
      mouseStartY = null;
    });

    _SocketConnection.SocketConnection.setupSockets();

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
    return 1000 / 60 * (60 / this.targetFPS) - 1000 / 60 * 0.5;
  }

  static movePlayer() {}

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
      _ObjectRegistry.ObjectRegistry.addToRenderQueue(this);

      let s = yield _Map.SimpleMap.build("unbenannt1.json");

      _ObjectRegistry.ObjectRegistry.addToRenderQueue(s);

      let blackout = new _BlackoutAnimation.BlackoutAnimation();

      _ObjectRegistry.ObjectRegistry.addToRenderQueue(blackout);

      let mobileInput = new _MobileController.MobileController();
      if (isPhone()) _ObjectRegistry.ObjectRegistry.addToRenderQueue(mobileInput);
      let fpsCounter = new _FpsCounter.FPSCounter();

      _ObjectRegistry.ObjectRegistry.addToRenderQueue(fpsCounter);

      _ObjectRegistry.ObjectRegistry.resolveAllSprites();

      _AnimationController.AnimationController.hideBlackoutAnimation();
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
    Canvas.dTime = ts - this.lastFrame;

    if (ts - this.lastFrame < Canvas.minimalRedrawTime) {
      requestAnimationFrame(this.draw.bind(this));
      return;
    }

    this.lastFrame = ts;

    _ObjectRegistry.ObjectRegistry.renderToContext(this.ctx, ts);

    requestAnimationFrame(this.draw.bind(this));
  }

}

exports.default = Canvas;
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

},{"./AnimationController.js":1,"./BlackoutAnimation.js":2,"./FpsCounter.js":4,"./Map.js":5,"./MobileController.js":6,"./ObjectRegistry.js":7,"./SocketConnection.js":8,"./Sprite.js":9}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FPSCounter = void 0;

class FPSCounter {
  constructor() {
    this.fps = 0;
    this.times = [];
  }

  redraw(ctx, timestamp) {
    const now = performance.now();

    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }

    this.times.push(now);
    this.fps = this.times.length;
    ctx.fillStyle = "red";
    ctx.fillText("FPS: " + this.fps, 100, 0);
  }

}

exports.FPSCounter = FPSCounter;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleTile = exports.SimpleMap = void 0;

var _CanvasController = _interopRequireDefault(require("./CanvasController.js"));

var _ObjectRegistry = require("./ObjectRegistry.js");

var _SocketConnection = require("./SocketConnection.js");

var _Sprite = require("./Sprite.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const TILEMAXWIDTH = 30;
const TILEMAXHEIGHT = 30;
const MAPHEIGHT = 10;
const MAPWIDTH = 10;
const TILEWIDTH = 64;
const TILEHEIGHT = 64;

function getArrayIndexFromInt(x, y, w) {
  return y * w + x;
}

class Builder {}

class SimpleMap {
  constructor(config) {
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = config.width;
    this.height = config.height;
    this.spriteHeight = config.tileheight * 2;
    this.spriteWidth = config.tilewidth * 2;
    this.spriteUrl = "/assets/maps/test.png";
    this.loadedTiles = new Array(this.width * this.height).fill(null);
    this.loadedObjects = new Array(this.width * this.height).fill(null);
    this.loadedTeleports = [];
    ;
    this.map = getData("ground", config.layers);
    this.objects = getData("objects", config.layers);
    console.log(config);
    let spawnX = getPropertiesData("spawnX", getData("ground", config.layers).properties);
    let spawnY = getPropertiesData("spawnY", getData("ground", config.layers).properties);
    this.posX = spawnX.value * -1;
    this.posY = spawnY.value * -1;
    let teleports = getData("teleporters", config.layers);
    console.log(teleports);
    let tBuf = [];

    for (let o of teleports.objects) {
      let destProperty = getPropertiesData("destination", o.properties);
      let obj = {
        x: Math.floor(o.x / (this.tileWidth / 2)),
        y: Math.floor(o.y / (this.tileHeight / 2)),
        destination: destProperty.value,
        id: null
      };
      tBuf.push(obj);
    }

    this.teleports = tBuf;
    this.spawnPlayer();
  }

  get x() {
    return this.posX;
  }

  get y() {
    return this.posY;
  }

  get visualOffsetX() {
    return this.offsetX * this.spriteWidth;
  }

  get visualOffsetY() {
    return this.offsetY * this.spriteHeight;
  }

  get middleX() {
    return Math.floor(_CanvasController.default.width / this.spriteWidth / 2) * this.spriteWidth;
  }

  get middleY() {
    return Math.floor(_CanvasController.default.height / this.spriteHeight / 2) * this.spriteHeight;
  }

  static build(filename) {
    return new Promise((res, rej) => {
      fetch("/assets/levels/" + filename).then(e => {
        return e.json();
      }).then(json => {
        console.log(json);
        let w = new SimpleMap(json);
        w.mapName = filename;
        res(w);
      });
    });
  }

  setOffset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  get tileWidth() {
    return this.spriteWidth;
  }

  get tileHeight() {
    return this.spriteHeight;
  }

  get tilesAvailableY() {
    return _CanvasController.default.height / this.tileHeight;
  }

  get tilesAvailableX() {
    return _CanvasController.default.width / this.tileWidth;
  }

  unloadSprites() {
    URL.revokeObjectURL(this.textureUrl);
    console.log(this.textureUrl);
  }

  spawnPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
      let player = new _Sprite.SimplePlayer(this.posX * -1, this.posY * -1);

      _ObjectRegistry.ObjectRegistry.addToMap(player);

      let msg = yield _SocketConnection.SocketConnection.getPlayersOnMap(this.mapName);
      console.log(msg);
    });
  }

  onAnimation(x, y) {
    throw new Error("Method not implemented.");
  }

  set map(m) {
    this.loadedTiles = m.data.map(t => {
      return new SimpleTile(t);
    });
  }

  set objects(m) {
    this.loadedObjects = m.data.map(t => {
      return new SimpleTile(t);
    });
  }

  set teleports(t) {
    t.forEach(e => {
      e.id = this.loadedTeleports.length;
      this.loadedTeleports.push(e);
    });
  }

  resolveSprites() {
    return new Promise((res, rej) => {
      fetch(this.spriteUrl).then(e => {
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

  redraw(ctx, timestamp) {
    for (let y = this.y; y < this.tilesAvailableY + 2; y++) {
      for (let x = this.x; x < this.tilesAvailableX + 2; x++) {
        let d = this.getMapDataXY(x - this.x, y - this.y);
        this.drawToMap(ctx, d, x, y, timestamp);
      }
    }

    for (let y = this.y; y < this.tilesAvailableY + 2; y++) {
      for (let x = this.x; x < this.tilesAvailableX + 2; x++) {
        this.drawToMap(ctx, this.getTeleportsXYTile(x - this.x, y - this.y), x, y, timestamp);
        this.drawToMap(ctx, this.getObjectsXY(x - this.x, y - this.y), x, y, timestamp);

        let npc = _ObjectRegistry.ObjectRegistry.getNPCinXY(x - this.x, y - this.y);

        this.drawToMap(ctx, npc, x, y, timestamp);
      }
    }

    ctx.fillStyle = "red";
    _ObjectRegistry.ObjectRegistry.DEBUG && ctx.fillRect(this.middleX, this.middleY, this.tileWidth, this.tileHeight);
  }

  drawToMap(ctx, object, x, y, timestamp) {
    var _a;

    object === null || object === void 0 ? void 0 : object.drawAt(ctx, timestamp, x * this.tileWidth + this.visualOffsetX + this.middleX, y * this.tileHeight + this.visualOffsetY + this.middleY, this.tileWidth, this.tileHeight);
    _ObjectRegistry.ObjectRegistry.DEBUG && ((_a = object === null || object === void 0 ? void 0 : object.drawDbg) === null || _a === void 0 ? void 0 : _a.call(object, ctx, timestamp, x * this.tileWidth + this.visualOffsetX + this.middleX, y * this.tileHeight + this.visualOffsetY + this.middleY, this.tileWidth, this.tileHeight));
  }

  getAreaObj(v) {
    throw new Error("Not implemented");
  }

  getArea(x_, y_, width, height) {
    let buf = Array();

    for (let y = y_; y < height + y_; y++) {
      for (let x = x_; x < width + x_; x++) {
        let tile = this.getMapDataXY(x, y);
        buf.push(tile);
      }
    }

    return buf;
  }

  getMapDataXY(x, y) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;
    let index = SimpleMap.getI(x, y, this.width);
    let data = this.loadedTiles[index];
    if (data === undefined) return null;
    return data;
  }

  getTeleports() {
    return this.loadedTeleports;
  }

  getTeleportsXY(x, y) {
    for (let n of this.getTeleports()) {
      if (n.x === x && n.y === y) {
        return n;
      }
    }

    return null;
  }

  getTeleportsXYTile(x, y) {
    if (this.getTeleportsXY(x, y) !== null) {
      return new SimpleTile(658);
    }

    return null;
  }

  getObjectsXY(x, y) {
    if (x >= this.width || y >= this.height || x < 0 || y < 0) return null;
    let index = SimpleMap.getI(x, y, this.width);
    let data = this.loadedObjects[index];
    if (data === undefined) return null;
    return data;
  }

  getSpritesheet() {
    return this.texture;
  }

  static getXY(i, w, h) {
    let x = i % w;
    let y = Math.floor(i / h);
    return {
      x: x,
      y: y
    };
  }

  static getI(x, y, w) {
    return y * w + x;
  }

  moveUp() {
    this.posY++;
  }

  moveDown() {
    this.posY--;
  }

  moveLeft() {
    this.posX++;
  }

  moveRight() {
    this.posX--;
  }

}

exports.SimpleMap = SimpleMap;

class SimpleTile {
  constructor(id) {
    this.tileWidthSprite = 32;
    this.tileHeightSprite = 32;
    this.spriteId = null;

    if (id && id !== 0) {
      this.spriteId = id - 1;
    } else {
      this.spriteId = null;
    }
  }

  get id() {
    return this.spriteId;
  }

  drawAt(ctx, timestamp, x, y, w, h) {
    let o = _ObjectRegistry.ObjectRegistry.world.getSpritesheet();

    if (this.spriteId !== null && this.hasImageLoaded(o)) {
      let xy = SimpleMap.getXY(this.spriteId, 30, 30);
      ctx.drawImage(o, xy.x * this.tileWidthSprite, xy.y * this.tileHeightSprite, this.tileWidthSprite, this.tileHeightSprite, x, y, w, h);
    }
  }

  drawDbg(ctx, timestamp, x, y, w, h) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText(`(${x / this.tileWidthSprite / 2}/${y / this.tileHeightSprite / 2})`, x, y + 18, w);
  }

  hasImageLoaded(img) {
    return img !== null && img instanceof HTMLImageElement;
  }

}

exports.SimpleTile = SimpleTile;

function getData(name, layers) {
  for (let layer of layers) {
    if (layer.name === name) return layer;
  }

  throw new Error(name + " data couldn't be found");
}

function getPropertiesData(name, layers) {
  for (let layer of layers) {
    if (layer.name === name) return layer;
  }

  throw new Error(name + " data couldn't be found");
}

},{"./CanvasController.js":3,"./ObjectRegistry.js":7,"./SocketConnection.js":8,"./Sprite.js":9}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileController = void 0;

var _CanvasController = _interopRequireDefault(require("./CanvasController.js"));

var _ObjectRegistry = require("./ObjectRegistry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MobileController {
  constructor() {
    this.touchEvents = [];
    this.mouseeventX = null;
    this.mouseeventY = null;
    window.addEventListener("touchstart", event => {
      this.process(event);
    });
    window.addEventListener("mousedown", this.process.bind(this));
    window.addEventListener("mouseup", event => {
      this.mouseeventX = null;
      this.mouseeventY = null;
    });
    this.updateTouchEvents();
  }

  get dpadX() {
    return 0;
  }

  get dpadY() {
    return _CanvasController.default.height - 160;
  }

  get dpadWidth() {
    return 160;
  }

  get dpadHeight() {
    return 160;
  }

  updateTouchEvents() {
    this.touchEvents = [];
    this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadUp.bind(this));
    this.addTouchHandler(this.dpadX + this.dpadWidth / 3, this.dpadY + this.dpadHeight / 3 * 2, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadDown.bind(this));
    this.addTouchHandler(this.dpadX + this.dpadWidth / 3 * 2, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadRight.bind(this));
    this.addTouchHandler(this.dpadX, this.dpadY + this.dpadHeight / 3, this.dpadWidth / 3, this.dpadHeight / 3, this.dpadLeft.bind(this));
  }

  process(event) {
    var _a, _b;

    let x = (_a = event.clientX) !== null && _a !== void 0 ? _a : event.changedTouches[0].clientX;
    let y = (_b = event.clientY) !== null && _b !== void 0 ? _b : event.changedTouches[0].clientY;

    if (x < 160 && y > _CanvasController.default.height - 160) {
      if (event instanceof MouseEvent) {
        this.processClickOnDpad(event);
      } else {
        this.processTouchOnDpad(event);
      }

      this.mouseeventX = x;
      this.mouseeventY = y;
    }
  }

  processClickOnDpad(touch) {
    for (let i of this.touchEvents) {
      if (i.x < touch.clientX && i.y < touch.clientY && touch.clientX < i.x + i.width && touch.clientY < i.y + i.height) {
        this.vibrate();
        i.callback();
      }
    }
  }

  processTouchOnDpad(event) {
    for (let touch of event.touches) {
      for (let i of this.touchEvents) {
        if (i.x < touch.clientX && i.y < touch.clientY && touch.clientX < i.x + i.width && touch.clientY < i.y + i.height) {
          this.vibrate();
          i.callback();
        }
      }
    }
  }

  addTouchHandler(x, y, w, h, callback) {
    this.touchEvents.push({
      x: x,
      y: y,
      width: w,
      height: h,
      callback: callback
    });
  }

  vibrate() {
    var _a, _b;

    if (window.navigator.vibrate) {
      (_b = (_a = window.navigator).vibrate) === null || _b === void 0 ? void 0 : _b.call(_a, 200);
    }
  }

  redraw(ctx, timestamp) {
    if (this.texture) ctx.drawImage(this.texture, 0, _CanvasController.default.height - 160);
  }

  redrawDbg(ctx, timestamp) {
    for (let e of this.touchEvents) {
      ctx.fillStyle = "rgba(255,0,0,0.25)";
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }
  }

  resolveSprites() {
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

  dpadUp() {
    _ObjectRegistry.ObjectRegistry.player.moveUp();
  }

  dpadDown() {
    _ObjectRegistry.ObjectRegistry.player.moveDown();
  }

  dpadLeft() {
    _ObjectRegistry.ObjectRegistry.player.moveLeft();
  }

  dpadRight() {
    _ObjectRegistry.ObjectRegistry.player.moveRight();
  }

}

exports.MobileController = MobileController;

},{"./CanvasController.js":3,"./ObjectRegistry.js":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectRegistry = void 0;

var _AnimationController = require("./AnimationController.js");

var _CanvasController = _interopRequireDefault(require("./CanvasController.js"));

var _Map = require("./Map.js");

var _MobileController = require("./MobileController.js");

var _Sprite = require("./Sprite.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function getDebug() {
  let URL = new URLSearchParams(window.location.search);
  return URL.get("debug") === "1";
}

class ObjectRegistry {
  static get world() {
    return this.renderQueue[this.worldId];
  }

  static get player() {
    return this.mapObjects[this.playerId];
  }

  static get canvasController() {
    return this.renderQueue[this.canvasControllerId];
  }

  static get mobileController() {
    if (this.renderQueue[this.mobileControllerId] === undefined) return null;
    return this.renderQueue[this.mobileControllerId];
  }

  static addToRenderQueue(obj) {
    if (obj instanceof _Map.SimpleMap) this.worldId = this.renderQueue.length;
    if (obj instanceof _CanvasController.default) this.canvasControllerId = this.renderQueue.length;
    if (obj instanceof _MobileController.MobileController) this.mobileControllerId = this.renderQueue.length;
    this.renderQueue.push(obj);
    return this.renderQueue.length - 1;
  }

  static addToMap(obj) {
    if (obj instanceof _Sprite.SimplePlayer) this.playerId = this.mapObjects.length;
    this.mapObjects.push(obj);
  }

  static renderToContext(ctx, timestamp) {
    var _a;

    for (let q of this.renderQueue) {
      q.redraw(ctx, timestamp);
      if (this.DEBUG) (_a = q.redrawDbg) === null || _a === void 0 ? void 0 : _a.call(q, ctx, timestamp);
    }
  }

  static getWorldForAnimation() {
    return this.world;
  }

  static resolveAllSprites() {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        let filter = this.renderQueue.filter(this.instanceOfResourceLoader);

        for (let res of filter) {
          yield res.resolveSprites();
        }

        yield _Sprite.PlayerEntity.resolveSprites();
        res();
      }));
    });
  }

  static getAllNPC() {
    let npcs = this.mapObjects.filter(this.instanceOfMapObject);
    return npcs;
  }

  static getNPCwithId(id) {
    let npcs = this.getAllNPC().filter(npc => {
      return npc.id === id;
    });
    if (npcs.length === 0) return null;
    return npcs.pop();
  }

  static getNPCinXY(x, y) {
    for (let n of this.getAllNPC()) {
      if (n.x === x && n.y === y) {
        return n;
      }
    }

    return null;
  }

  static getXYAllLayers(x, y) {
    return [this.world.getMapDataXY(x, y), this.getNPCinXY(x, y)];
  }

  static getNPCinArea(x, y, w, h) {
    let buf = Array();

    for (let y_ = y; y_ < h + y; y_++) {
      for (let x_ = x; x_ < w + x; x_++) {
        buf.push(this.getNPCinXY(x_, y_));
      }
    }

    return buf;
  }

  static instanceOfResourceLoader(object) {
    return 'resolveSprites' in object;
  }

  static instanceOfMapObject(object) {
    if ('drawAt' in object) {
      return true;
    }

    return 'drawAt' in object;
  }

  static NPCisInArea(npc, x, y, w, h) {
    return npc.x >= x && npc.y >= y && npc.x < x + w && npc.y < y + h;
  }

  static removeNPC(id) {
    console.log(id);
    this.mapObjects.splice(id, 1);
  }

  static goToLevel(levelname) {
    return __awaiter(this, void 0, void 0, function* () {
      yield _AnimationController.AnimationController.showBlackoutAnimation();
      this.world.unloadSprites();

      while (this.mapObjects.length !== 0) {
        this.mapObjects.pop();
      }

      let w = yield _Map.SimpleMap.build(levelname);
      yield w.resolveSprites();
      this.renderQueue[this.worldId] = w;
      yield _AnimationController.AnimationController.hideBlackoutAnimation();
    });
  }

}

exports.ObjectRegistry = ObjectRegistry;
ObjectRegistry.renderQueue = new Array();
ObjectRegistry.mapObjects = new Array();
ObjectRegistry.DEBUG = getDebug();
ObjectRegistry.canvasControllerId = -1;
ObjectRegistry.worldId = -1;
ObjectRegistry.playerId = -1;
ObjectRegistry.mobileControllerId = -1;

},{"./AnimationController.js":1,"./CanvasController.js":3,"./Map.js":5,"./MobileController.js":6,"./Sprite.js":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocketConnection = void 0;

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

class SocketConnection {
  static setupSockets() {
    return __awaiter(this, void 0, void 0, function* () {
      this.socketConnection = yield new Promise((res, rej) => {
        let socket = new WebSocket("ws://localhost:80");

        socket.onopen = e => {
          console.log("connected");
          res(socket);
        };
      });
    });
  }

  static send(eventname) {
    return new Promise((res, rej) => {
      this.socketConnection.send(eventname);

      this.socketConnection.onmessage = msg => {
        res(msg.data);
      };
    });
  }

  static onMessage(e) {
    console.log(e);
  }

  static getPlayersOnMap(mapname) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.send("playersOnMap");
    });
  }

}

exports.SocketConnection = SocketConnection;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimplePlayer = exports.PlayerEntity = exports.PlayerDirection = void 0;

var _AnimationController = require("./AnimationController.js");

var _ObjectRegistry = require("./ObjectRegistry.js");

var _SocketConnection = require("./SocketConnection.js");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var PlayerDirection;
exports.PlayerDirection = PlayerDirection;

(function (PlayerDirection) {
  PlayerDirection[PlayerDirection["DOWN"] = 0] = "DOWN";
  PlayerDirection[PlayerDirection["LEFT"] = 1] = "LEFT";
  PlayerDirection[PlayerDirection["RIGHT"] = 2] = "RIGHT";
  PlayerDirection[PlayerDirection["UP"] = 3] = "UP";
})(PlayerDirection || (exports.PlayerDirection = PlayerDirection = {}));

class PlayerEntity extends _SocketConnection.SocketConnection {
  constructor(x, y) {
    super();
    this.offsetX = 0;
    this.offsetY = 0;
    this.walkingProgress = 0;
    this.movementBlocked = true;
    this.idServer = null;
    this.direction = PlayerDirection.DOWN;
    this.x_ = x;
    this.y_ = y;
  }

  get x() {
    return this.x_;
  }

  get y() {
    return this.y_;
  }

  get id() {
    return _ObjectRegistry.ObjectRegistry.mapObjects.indexOf(this);
  }

  get width() {
    return 64;
  }

  get height() {
    return 64;
  }

  get visualOffsetX() {
    return this.offsetX * this.width;
  }

  get visualOffsetY() {
    return this.offsetY * this.height;
  }

  progressWalking() {
    let p = this.walkingProgress + 1;
    this.walkingProgress = p % 4;
  }

  progressWalkingBackwards() {
    let p = this.walkingProgress + 1;
    this.walkingProgress = p % 4;
  }

  standStill() {
    this.walkingProgress = 0;
  }

  static onMessage(e) {
    console.log("PlayerEntity", e);
  }

  setOffset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  static resolveSprites() {
    console.log("Resolving Player Sprites");
    return new Promise((res, rej) => {
      if (PlayerEntity.texture !== null) res();
      fetch("/assets/sprites/player.png").then(e => {
        return e.blob();
      }).then(blob => {
        let img = new Image();
        PlayerEntity.textureUrl = URL.createObjectURL(blob);
        img.src = PlayerEntity.textureUrl;
        PlayerEntity.texture = img;
        res();
      });
    });
  }

  drawAt(ctx, timestamp, x, y, w, h) {
    if (PlayerEntity.texture !== null) {
      ctx.drawImage(PlayerEntity.texture, this.walkingProgress * this.width, this.direction * this.height, this.width, this.height, x + this.visualOffsetX, y + this.visualOffsetY, this.width, this.height);
    }
  }

  draw(ctx, timestamp) {}

  drawDbg(ctx, timestamp, x, y, w, h) {
    ctx.fillStyle = "green";
    ctx.fillRect(x * w, y * h, w, h);
  }

  lookTo(dir) {
    this.direction = dir;
  }

  remove() {
    _ObjectRegistry.ObjectRegistry.removeNPC(this.id);
  }

}

exports.PlayerEntity = PlayerEntity;
PlayerEntity.texture = null;

class SimplePlayer extends PlayerEntity {
  check(o) {
    var _a;

    if (o[0] === null || ((_a = o[0]) === null || _a === void 0 ? void 0 : _a.id) === null) return false;
    if (o[1] !== null) return false;
    if (o[2] !== null) return true;
    return true;
  }

  teleportIfNeeded() {
    let tp = _ObjectRegistry.ObjectRegistry.world.getTeleportsXY(this.x, this.y);

    if (tp !== null) {
      _ObjectRegistry.ObjectRegistry.goToLevel(tp.destination);
    }
  }

  moveUp() {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        if (this.movementBlocked || _AnimationController.AnimationController.isMoving) return;
        this.lookTo(PlayerDirection.UP);

        let o = _ObjectRegistry.ObjectRegistry.getXYAllLayers(this.x, this.y - 1);

        this.check(o) && (yield _AnimationController.AnimationController.mapMoveUp());
        res();
        this.teleportIfNeeded();
      }));
    });
  }

  moveDown() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.movementBlocked || _AnimationController.AnimationController.isMoving) return;
      this.lookTo(PlayerDirection.DOWN);

      let o = _ObjectRegistry.ObjectRegistry.getXYAllLayers(this.x, this.y + 1);

      this.check(o) && (yield _AnimationController.AnimationController.mapMoveDown());
      this.teleportIfNeeded();
    });
  }

  moveLeft() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.movementBlocked || _AnimationController.AnimationController.isMoving) return;
      this.lookTo(PlayerDirection.LEFT);

      let o = _ObjectRegistry.ObjectRegistry.getXYAllLayers(this.x - 1, this.y);

      this.check(o) && (yield _AnimationController.AnimationController.mapMoveLeft());
      this.teleportIfNeeded();
    });
  }

  moveRight() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.movementBlocked || _AnimationController.AnimationController.isMoving) return;
      this.lookTo(PlayerDirection.RIGHT);

      let o = _ObjectRegistry.ObjectRegistry.getXYAllLayers(this.x + 1, this.y);

      this.check(o) && (yield _AnimationController.AnimationController.mapMoveRight());
      this.teleportIfNeeded();
    });
  }

}

exports.SimplePlayer = SimplePlayer;

},{"./AnimationController.js":1,"./ObjectRegistry.js":7,"./SocketConnection.js":8}],10:[function(require,module,exports){
"use strict";

var _CanvasController = _interopRequireDefault(require("./lib/CanvasController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = () => {
  window.canvas = new _CanvasController.default();
};

},{"./lib/CanvasController.js":3}]},{},[10]);
