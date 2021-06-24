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
import { PlayerDirection } from "../Map/MapObjects/Character.js";
import { SocketSubscriber } from "../Interfaces/SocketSubscriber.js";

export class WorldController implements Drawable, VisualOffset, InputHandler, SocketSubscriber {

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

  setVisualOffsetX(x: number, ts: number): void {
    // console.log(x, ts);
    this.charCont.setAnimationProgressOfPlayer(ts);
    this.visualXOffset = x;
  }
  setVisualOffsetY(y: number, ts: number): void {
    this.charCont.setAnimationProgressOfPlayer(ts);
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
  onmessage(ev: MessageEvent<any>): void {
    // throw new Error("Method not implemented.");
    this.charCont.onmessage(ev);
  }

  messageId!: string;
  send(): void {
    throw new Error("Method not implemented.");
  }

  finalizeX(pos: boolean, distance: number): void {
    this.x_ += (pos ? -1 : 1) * distance;
    this.charCont.setAnimationProgressOfPlayer(0);
  }
  finalizeY(pos: boolean, distance: number): void {
    this.y_ += (pos ? -1 : 1) * distance;
    this.charCont.setAnimationProgressOfPlayer(0);
  }

  onKeyboardEvent(e: KeyboardEvent): void {
    console.log(e);
    if (this.hasActiveEvent) return;

    switch (e.key) {
      case "w":
        this.charCont.playerLookAt(PlayerDirection.UP);
        if (this.check(this.map!.getMapDataXY(this.x, this.y - 1)) && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y - 1))) AnimationController.scheduleMapMoveAnimation(this, "y", true);
        break;
        
        case "a":
        this.charCont.playerLookAt(PlayerDirection.LEFT);
        if (this.check(this.map!.getMapDataXY(this.x  - 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x - 1, this.y))) AnimationController.scheduleMapMoveAnimation(this, "x", true);
        break;
        
        case "s":
        this.charCont.playerLookAt(PlayerDirection.DOWN);
        if (this.check(this.map!.getMapDataXY(this.x, this.y + 1)) && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y + 1))) AnimationController.scheduleMapMoveAnimation(this, "y", false);
        break;
        
        case "d":
        this.charCont.playerLookAt(PlayerDirection.RIGHT);
        if (this.check(this.map!.getMapDataXY(this.x + 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x +1, this.y)) ) AnimationController.scheduleMapMoveAnimation(this, "x", false);
        break;

        case "ArrowUp":
        this.charCont.allCharsUp();
        break;
        case "ArrowLeft":
        this.charCont.allCharsLeft();
        break;

        case "ArrowDown":
        this.charCont.allCharsDown();
        break;
        case "ArrowRight":
        this.charCont.allCharsRight();
        break;

      case "u":
        console.log("u");
        this.currentMap?.unloadResource();
        break;
      }
  }

  private checkNPC(o: MapDrawable | null): boolean {
    console.log(o);
    if (o === null) return true;
    return false;
  }

  private check(o: Array<MapDrawable | null>): boolean {
    console.log(o);
    if (o[0] === null) return false;
    return true;
  }

  private x_: number = 4;
  get x() {
    return this.x_;
  }

  private y_: number = 4;
  get y() {
    return this.y_;
  }

  async loadMap(m: GameMap) {
    (this.map as unknown as ResourceLoader)?.unloadResource();
    await m.resolveResource();
    this.currentMap = m;
    await this.charCont.resolveResource();
  }

  redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(this.map)) {
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
          for (let mapdata of data) {
            mapdata?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }

          let char = this.charCont.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
          char?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
        }
      }

      this.charCont.drawPlayer(ctx, Math.floor(this.tilesAvailableX / 2) * this.tileWidth + this.tileWidth / 2, Math.floor(this.tilesAvailableY / 2) * this.tileHeight + this.tileHeight / 2, this.tileWidth, this.tileHeight);
    }
  }
  
  redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(this.map)) {
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = this.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
          
          for (let mapdata of data) {
            mapdata?.drawDbg?.(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);

          }
          let char = this.charCont.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
          // char?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
        }
      }
    }
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