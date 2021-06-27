import Canvas from "./CanvasController";
import { Drawable } from "../Interfaces/Drawable";
import { GameMap } from "../Map/GameMap";
import { VisualOffset } from "../Interfaces/VisualOffset";
import { InputHandler } from "../Interfaces/InputHandler";
import { ResourceLoader } from "../Interfaces/ResourceLoader";

import { AnimationController } from "./AnimationController";
import { MapDrawable } from "../Interfaces/MapDrawable";
import { CharacterController } from "./CharacterController";
import { Character, PlayerDirection } from "../Map/MapObjects/Character";
import { AudioController } from "./AudioController";
import { PlayerX, PlayerY } from "../Interfaces/ServerEvents";
import { MultiplayerClient } from "../Client/SocketClient";

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

  /*   get map(): Mappable | null {
      return this.currentMap;
    } */

  setVisualOffsetX(x: number, ts: number): void {
    // console.log(x, ts);
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
    WorldController.x_ += (pos ? -1 : 1) * distance;
    // this.charCont.ownPlayer!!.x = this.x;
    this.charCont.setAnimationProgressOfPlayer(0);

    this.charCont.client.send<PlayerX>("playerx", {
      newX: (pos ? -1 : 1) * distance
    }).then(console.log);
  }
  finalizeY(pos: boolean, distance: number): void {
    WorldController.y_ += (pos ? -1 : 1) * distance;
    // this.charCont.ownPlayer!!.y = this.y;
    this.charCont.setAnimationProgressOfPlayer(0);

    this.charCont.client.send<PlayerY>("playery", {
      newY: (pos ? -1 : 1) * distance
    }).then(console.log);
  }

  onKeyboardEvent(e: KeyboardEvent): void {
    //console.log(e);
    if (this.hasActiveEvent) return;

    // console.log(e);

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
        //alert("Hello from worldcontroller");
        Character.playDingSound();
        break;

      case "i":
        AudioController.activateAudioContext();
        break;

      /*       case "ArrowUp":
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
              break; */

      case "u":
        console.log("u");
        WorldController.map!.unloadResource();
        break;
    }
  }

  public movePlayerUp() {
    this.charCont.playerLookAt(PlayerDirection.UP);
    if (this.check(WorldController.map!.getMapDataXY(this.x, this.y - 1))
      && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y - 1))) {
      // AnimationController.scheduleMapMoveAnimation(this, "y", true);
      this.charCont.moveOwnUp();
      
    }
  }
  
  public movePlayerDown() {
    this.charCont.playerLookAt(PlayerDirection.DOWN);
    if (this.check(WorldController.map!.getMapDataXY(this.x, this.y + 1)) && this.checkNPC(this.charCont.getMapDataXY(this.x, this.y + 1))) {
      // AnimationController.scheduleMapMoveAnimation(this, "y", false);
      this.charCont.moveOwnDown();
    }
  }

  public movePlayerLeft() {
    this.charCont.playerLookAt(PlayerDirection.LEFT);
    if (this.check(WorldController.map!.getMapDataXY(this.x - 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x - 1, this.y))) {
      // AnimationController.scheduleMapMoveAnimation(this, "x", true);
      this.charCont.moveOwnLeft();
    }
  }
  
  public movePlayerRight() {
    this.charCont.playerLookAt(PlayerDirection.RIGHT);
    if (this.check(WorldController.map!.getMapDataXY(this.x + 1, this.y)) && this.checkNPC(this.charCont.getMapDataXY(this.x + 1, this.y)))
    {
      // AnimationController.scheduleMapMoveAnimation(this, "x", false);
      // this.charCont.
      this.charCont.moveOwnRight();
    }
  }

  private checkNPC(o: MapDrawable | null): boolean {
    // console.log(o);
    if (o === null) return true;
    return false;
  }

  private check(o: Array<MapDrawable | null>): boolean {
    // console.log(o);
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
            if ((char as Character).id === MultiplayerClient.Client.id) {
              // console.log((char as Character).id === MultiplayerClient.Client.id);
              // return;
            };
            char.drawAt(ctx, timestamp, x * this.tileWidth + this.getVisualOffsetX(), y * this.tileHeight + this.getVisualOffsetY(), this.tileWidth, this.tileHeight);
          }
        }
      }

      // this.charCont.drawPlayer(ctx, Math.floor(this.tilesAvailableX / 2) * this.tileWidth + this.tileWidth / 2, Math.floor(this.tilesAvailableY / 2) * this.tileHeight + this.tileHeight / 2, this.tileWidth, this.tileHeight);
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