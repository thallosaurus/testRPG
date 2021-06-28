import Canvas from "./CanvasController";
import { Drawable } from "../Interfaces/Drawable";
import { GameMap } from "../Map/GameMap";
import { VisualOffset } from "../Interfaces/VisualOffset";
import { InputHandler } from "../Interfaces/InputHandler";
import { ResourceLoader } from "../Interfaces/ResourceLoader";
import { MapDrawable } from "../Interfaces/MapDrawable";
import { CharacterController } from "./CharacterController";
import { Character } from "../Map/MapObjects/Character";
import { AudioController } from "./AudioController";
import { LevelChangeEvent } from "../Interfaces/ServerEvents";

export class WorldController implements Drawable, VisualOffset, InputHandler {

  static map: GameMap | null = null;
  static charCont: CharacterController = new CharacterController();

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

  get charCont() {
    return WorldController.charCont;
  }

  setVisualOffsetX(x: number, ts: number): void {
    this.charCont.setAnimationProgressOfPlayer(ts);
    this.charCont.ownPlayer!!.visualXOffset = x * -1;
    this.visualXOffset = x;
  }
  setVisualOffsetY(y: number, ts: number): void {
    this.charCont.setAnimationProgressOfPlayer(ts);
    this.visualYOffset = y;
    this.charCont.ownPlayer!!.visualYOffset = y * -1;
  }
  getVisualOffsetX(): number {
    return this.visualXOffset + (this.tileWidth / 2);
  }
  getVisualOffsetY(): number {
    return this.visualYOffset + (this.tileHeight / 2);
  }

  constructor() {
    this.charCont.setParent(this);
  }

  finalizeX(pos: boolean, distance: number): void {
    WorldController.x_ = (pos ? -1 : 1) * distance;
    this.charCont.setAnimationProgressOfPlayer(0);
  }
  finalizeY(pos: boolean, distance: number): void {
    WorldController.y_ = (pos ? -1 : 1) * distance;
    this.charCont.setAnimationProgressOfPlayer(0);
  }

  onKeyboardEvent(e: KeyboardEvent): void {
      switch (e.key) {
        case "w":
          this.movePlayerUp();
          break;

        case "a":
          this.movePlayerLeft();
          break;

        case "s":
          this.movePlayerDown();
          break;

        case "d":
          this.movePlayerRight();
          break;

        case "Enter":
          Character.playDingSound();
          break;

        case "i":
          AudioController.activateAudioContext();
          break;

        case "u":
          console.log("u");
          WorldController.map!.unloadResource();
          break;

        case "t":
          this.teleport();
          break;
      }
      // res()
  }

  public teleport() {
    let lvl = prompt("new level? (Full path)");
    if (lvl !== null && lvl !== "") {
      this.charCont.client.send<LevelChangeEvent>("levelchange", {
        level: lvl!
      });
    }
  }

  public movePlayerUp() {
    if (this.check(WorldController.map!.getMapDataXY(this.x, this.y - 1))
      && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y - 1))) {
      this.charCont.moveOwnUp();
    }
  }

  public movePlayerDown() {
    if (this.check(WorldController.map!.getMapDataXY(this.x, this.y + 1))
      && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y + 1))) {
      this.charCont.moveOwnDown();
    }
  }

  public movePlayerLeft() {
    if (this.check(WorldController.map!.getMapDataXY(this.x - 1, this.y))
      && this.checkNPC(this.charCont.getMapDataXY(this.x - 1, this.y))) {
      this.charCont.moveOwnLeft();
    }
  }

  public movePlayerRight() {
    if (this.check(WorldController.map!.getMapDataXY(this.x + 1, this.y))
      && this.checkNPC(this.charCont.getMapDataXY(this.x + 1, this.y))) {
      this.charCont.moveOwnRight();
    }
  }

  private checkNPC(o: MapDrawable | null): boolean {
    if (o === null) return true;
    return false;
  }

  private check(o: Array<MapDrawable | null>): boolean {
    if (o[0] === null) return false;
    return true;
  }

  static x_: number = 4;
  get x() {
    return WorldController.x_;
  }

  static y_: number = 4;
  get y() {
    return WorldController.y_;
  }

  static async loadMap(m: GameMap) {
    (WorldController.map as unknown as ResourceLoader)?.unloadResource();
    await m.resolveResource();
    WorldController.map = m;
    await this.charCont.resolveResource();
  }

  redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(WorldController.map)) {
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = WorldController.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));
          for (let mapdata of data) {
            mapdata?.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }

        }
      }

      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let char = this.charCont.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));

          if (char !== null) {
            char.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }
        }
      }
    }
  }

  redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number): void {
    if (isAMapLoaded(WorldController.map)) {
      for (let y = -2; y < this.tilesAvailableY + 1; y++) {
        for (let x = -2; x < this.tilesAvailableX + 1; x++) {
          let data = WorldController.map.getMapDataXY(x + this.x - Math.floor(this.tilesAvailableX / 2), y + this.y - Math.floor(this.tilesAvailableY / 2));

          for (let mapdata of data) {
            mapdata?.drawDbg?.(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);

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
  getMapDataXY(x: number, y: number): Array<MapDrawable | null>;
  getArea(x: number, y: number, w: number, h: number): Array<Array<MapDrawable | null>>;
}

export interface SubMappable {
  getMapDataXY(x: number, y: number): MapDrawable | null;
}