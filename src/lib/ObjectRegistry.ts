import { AnimationController } from "./AnimationController.js";
import Canvas, { Drawable } from "./CanvasController.js";
import { Animate, MapDrawable, MapObject, ResourceLoader, SimpleMap } from './Map.js';
import { MobileController } from "./MobileController.js";
import { PlayerEntity, SimplePlayer } from "./Sprite.js";


function getDebug() {
  let URL = new URLSearchParams(window.location.search);
  return URL.get("debug") === "1";
}

export class ObjectRegistry {
  static renderQueue: Array<Drawable> = new Array<Drawable>();
  static mapObjects: Array<MapObject> = new Array<MapObject>();
  static readonly DEBUG = getDebug();

  static canvasControllerId: number = -1;
  static worldId: number = -1;
  static playerId: number = -1;
  static mobileControllerId: number = -1;

  static get world(): SimpleMap {
    return this.renderQueue[this.worldId] as SimpleMap;
  }

  static get player(): SimplePlayer {
    return this.mapObjects[this.playerId] as SimplePlayer;
  }

  static get canvasController(): Canvas {
    return this.renderQueue[this.canvasControllerId] as Canvas;
  }

  static get mobileController(): MobileController | null {
    if (this.renderQueue[this.mobileControllerId] === undefined) return null;
    return this.renderQueue[this.mobileControllerId] as MobileController;
  }

  static addToRenderQueue(obj: Drawable): number {
    if (obj instanceof SimpleMap) this.worldId = this.renderQueue.length;
    if (obj instanceof Canvas) this.canvasControllerId = this.renderQueue.length;
    if (obj instanceof MobileController) this.mobileControllerId = this.renderQueue.length;
    this.renderQueue.push(obj);
    return this.renderQueue.length - 1;
    // debugger;
  }
  
  static addToMap(obj: MapObject): void {
    if (obj instanceof SimplePlayer) this.playerId = this.mapObjects.length;
    // obj.id = this.mapObjects.length;
    this.mapObjects.push(obj);
  }

  static renderToContext(ctx: CanvasRenderingContext2D, timestamp: number) {
    for (let q of this.renderQueue) {
      q.redraw(ctx, timestamp);
      if (this.DEBUG) q.redrawDbg?.(ctx, timestamp);
    }
    // debugger;
  }

  /**
   *
   * @deprecated
   * @static
   * @returns {Animate}
   * @memberof ObjectRegistry
   */
  static getWorldForAnimation() : Animate {
    return this.world;
  }

  static async resolveAllSprites(): Promise<void> {
    return new Promise(async (res, rej) => {
      let filter = this.renderQueue.filter(this.instanceOfResourceLoader);
      // console.log(filter);
      for (let res of filter) {
        await (res as unknown as ResourceLoader).resolveSprites();
      }

      await PlayerEntity.resolveSprites();
      res();
    });
  }

  static getAllNPC(): MapObject[] {
    let npcs = this.mapObjects.filter(this.instanceOfMapObject) as unknown as MapObject[];
    return npcs;
  }

  static getNPCwithId(id: number): MapObject | null {
    let npcs = this.getAllNPC().filter((npc) => {
      return (npc as unknown as MapObject).id === id;
    });

    if (npcs.length === 0) return null;
    return npcs.pop() as MapObject;
  }

  static getNPCinXY(x:number, y:number): MapObject | null {
    for(let n of this.getAllNPC()) {
      // console.log(n);
      if (n.x === x && n.y === y) {
        // console.log(n);
        return n;
      }
    }

    return null;
  }

  static getXYAllLayers(x:number, y:number) {
    return [
      this.world.getMapDataXY(x, y),
      this.getNPCinXY(x, y)
    ];
  }

  static getNPCinArea(x:number, y:number, w:number, h:number): Array<MapObject | null> {
    let buf = Array<MapObject | null>();
    
    for (let y_ = y; y_ < h + y; y_++) {
      for (let x_ = x; x_ < w + x; x_++) {
        buf.push(this.getNPCinXY(x_, y_));
      }
    }

    return buf;
  }

  static instanceOfResourceLoader(object: any): object is ResourceLoader {
    return 'resolveSprites' in object;
  }

  static instanceOfMapObject(object: any): object is MapObject {
    if ('drawAt' in object) {
      // console.log(object);
      return true;
    }
    return 'drawAt' in object;
  }

  static NPCisInArea(npc: MapObject, x:number, y:number, w:number, h:number) {
    return (npc.x >= x && npc.y >= y && npc.x < x + w && npc.y < y + h);
  }

  static removeNPC(id:number) {
    console.log(id);
    // let i = this.mapObjects.indexOf()
    this.mapObjects.splice(id, 1);
  }

  static async goToLevel(levelname: string) {
    await AnimationController.showBlackoutAnimation();
    this.world.unloadSprites();
    
    while(this.mapObjects.length !== 0) {
      this.mapObjects.pop();
    }

    let w = await SimpleMap.build(levelname);
    
    await w.resolveSprites();
    this.renderQueue[this.worldId] = w;

    await AnimationController.hideBlackoutAnimation();
  }
}
