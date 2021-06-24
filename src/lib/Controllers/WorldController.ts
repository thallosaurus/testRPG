import Canvas from "./CanvasController.js";
import { Drawable } from "../Interfaces/Drawable.js";
import { GameMap } from "../Map/GameMap.js";
import { SimpleTile } from "../Map/SimpleTile.js";
import { VisualOffset } from "../Interfaces/VisualOffset.js";
import { InputHandler } from "../Interfaces/InputHandler.js";
import { ResourceLoader } from "../Interfaces/ResourceLoader.js";

import { AnimationController } from "./AnimationController.js";
import { MapDrawable } from "../Interfaces/MapDrawable.js";
import { CharacterController } from "./CharacterController.js";

export class WorldController implements Drawable, VisualOffset, InputHandler {

  private currentMap: GameMap | null = null;
  private charCont: CharacterController;

  private spriteWidth: number = 64;
  private spriteHeight: number = 64;

  private visualXOffset: number = 0;
  private visualYOffset: number = 0;

  public hasActiveEvent: boolean = false;

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
    return this.visualXOffset + (this.tileWidth / 2);
  }
  getVisualOffsetY(): number {
    return this.visualYOffset + (this.tileHeight / 2);
  }

  constructor() {
    this.charCont = new CharacterController();
  }

  finalizeX(pos: boolean): void {
    this.x_ += pos ? -1 : 1;
  }
  finalizeY(pos: boolean): void {
    this.y_ += pos ? -1 : 1;
  }

  onKeyboardEvent(e: KeyboardEvent): void {
    console.log(e);
    if (this.hasActiveEvent) return;

    switch (e.key) {
      case "w":
        AnimationController.scheduleMapMoveAnimation(this, "y", true);
        break;

      case "a":
        AnimationController.scheduleMapMoveAnimation(this, "x", false);
        break;

      case "s":
        AnimationController.scheduleMapMoveAnimation(this, "y", false);
        break;
      
      case "d":
        AnimationController.scheduleMapMoveAnimation(this, "x", true);
        break;

      case "u":
        console.log("u");
        this.currentMap?.unloadResource();
        break;
      }
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
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x, y + this.y);
          for (let mapdata of data) {
            mapdata?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }

          let char = this.charCont.getMapDataXY(x + this.x, y + this.y);
          char?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          // console.log(char);
        }
      }
    }
  }
  
  redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(this.map)) {
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x, y + this.y);
          
          for (let mapdata of data) {
            mapdata?.drawDbg?.(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);

          }
          let char = this.charCont.getMapDataXY(x + this.x, y + this.y);
          char?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
        }
      }
    }

    ctx.beginPath();
    ctx.rect(Canvas.width / 2 - 10, Canvas.height / 2 - 10, 20, 20);
    ctx.stroke();
  }

  
}

function isAMapLoaded(map: any): map is Mappable {
  return map !== null;
}

export interface Mappable {
  getMapDataXY(x: number, y: number): Array<MapDrawable | null>;
  getArea(x: number, y: number, w: number, h: number): Array<Array<MapDrawable | null>>;
}

export interface SubMappable {
  getMapDataXY(x: number, y: number): MapDrawable | null;
}