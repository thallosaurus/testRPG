import Canvas from "./CanvasController.js";
import { Drawable } from "../Interfaces/Drawable.js";
import { GameMap } from "../Map/GameMap.js";
import { SimpleTile } from "../Map/SimpleTile.js";
import { VisualOffset } from "../Interfaces/VisualOffset.js";
import { InputHandler } from "../Interfaces/InputHandler.js";
import { ResourceLoader } from "../Interfaces/ResourceLoader.js";

export class WorldController implements Drawable, VisualOffset, InputHandler {

  private currentMap: GameMap | null = null;

  private spriteWidth: number = 64;
  private spriteHeight: number = 64;

  private visualXOffset: number = 0;
  private visualYOffset: number = 0;

/*   private x!: number;
  private y!: number; */

  get tilesAvailableY() {
    return Canvas.height / this.tileHeight;
  }

  get tilesAvailableX() {
    return Canvas.width / this.tileWidth;
  }

  get tileWidth() {
    return this.spriteWidth;
  }

  get tileHeight() {
    return this.spriteHeight;
  }

  get map(): Mappable | null {
    return this.currentMap;
  }

  setVisualOffsetX(x: number): void {
    this.visualXOffset = x;
  }
  setVisualOffsetY(y: number): void {
    this.visualYOffset = y;
  }
  getVisualOffsetX(): number {
    return this.visualXOffset;
  }
  getVisualOffsetY(): number {
    return this.visualYOffset;
  }

  constructor() {
    
  }

  onKeyboardEvent(e: KeyboardEvent): void {
    console.log(e);
    switch (e.key) {
      case "w":
        this.y_--;
        break;
      case "a":
        this.x_--;
        break;
      case "s":
        this.y_++;
        break;
      case "d":
        this.x_++;
        break;
    }

    console.log(this.x, this.y);
  }

  private x_: number = 0;
  get x() {
    return this.x_;
  }

  private y_: number = 0;
  get y() {
    return this.y_;
  }

  async loadMap(m: GameMap) {
    (this.map as unknown as ResourceLoader)?.unloadResource();
    await m.resolveResource();
    this.currentMap = m;
  }

  redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(this.map)) {
      // let data = this.map.getArea(0, 0, this.tilesAvailableX, this.tilesAvailableY);
      for (let y = -1; y < this.tilesAvailableY + 1; y++) {
        for (let x = -1; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x, y + this.y);
          for (let mapdata of data) {
            mapdata?.drawAt(ctx, timestamp, x * this.tileWidth  + this.getVisualOffsetX(), y * this.tileHeight  + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }
        }
      }
    }
    // throw new Error("Method not implemented.");
  }

  redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(this.map)) {
      for (let y = -1; y < this.tilesAvailableY + 1; y++) {
        for (let x = -1; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x, y + this.y);

          for (let mapdata of data) {
            mapdata?.drawDbg(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }
        }
      }
    }
  }
}

function isAMapLoaded(map: any): map is Mappable {
  return map !== null;
}

export interface Mappable {
  getMapDataXY(x: number, y: number): Array<SimpleTile | null>;
  getArea(x: number, y: number, w: number, h: number): Array<Array<SimpleTile | null>>;
}

export interface SubMappable {
  getMapDataXY(x: number, y: number): SimpleTile | null;
}