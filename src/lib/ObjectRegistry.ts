import Canvas, { Drawable } from "./CanvasController.js";
import { Animate, MapObject, ResourceLoader, SimpleMap, World } from './Map.js';
import Player, { PlayerEntity, SimplePlayer } from "./Sprite.js";

const DEBUG = true;

export class ObjectRegistry {
  static renderQueue: Array<Drawable> = new Array<Drawable>();
  static mapObjects: Array<MapObject> = new Array<MapObject>();

  static canvasControllerId: number = -1;
  static worldId: number = -1;
  static playerId: number = -1;

  static get world(): SimpleMap {
    return this.renderQueue[this.worldId] as SimpleMap;
  }

  static get player(): Player {
    return this.renderQueue[this.playerId] as Player;
  }

  static get canvasController(): Canvas {
    return this.renderQueue[this.canvasControllerId] as Canvas;
  }

  static addToRenderQueue(obj: Drawable): number {
    if (obj instanceof SimpleMap) this.worldId = this.renderQueue.length;
    if (obj instanceof SimplePlayer) this.playerId = this.renderQueue.length;
    if (obj instanceof Canvas) this.canvasControllerId = this.renderQueue.length;
    this.renderQueue.push(obj);
    return this.renderQueue.length - 1;
    // debugger;
  }

  static addToMap(obj: MapObject): void {
    this.mapObjects.push(obj);
  }

  static renderToContext(ctx: CanvasRenderingContext2D, timestamp: number) {
    for (let q of this.renderQueue) {
      q.redraw(ctx, timestamp);
      if (DEBUG) q.redrawDbg?.(ctx, timestamp);
    }
    // debugger;
  }

  static getWorldForAnimation() : Animate {
    return this.world;
  }

  static async resolveAllSprites(): Promise<void> {
    return new Promise(async (res, rej) => {
      let filter = this.renderQueue.filter(this.instanceOfResourceLoader);
      console.log(filter);
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

  /*
    public getArea(x_: number, y_: number, width: number, height: number): Array<SimpleTile | null> {
        let buf = Array<SimpleTile | null>();
        for (let y = y_; y < height + y_; y++) {
            for (let x = x_; x < width + x_; x++) {
                let tile = this.getMapDataXY(x, y);
                buf.push(tile);
            }
        }

        // debugger;

        return buf;
    }
  */
  static getNPCinArea(x:number, y:number, w:number, h:number): Array<MapObject | null> {
/*     let npcs = this.getAllNPC().filter((n) => {
      return this.NPCisInArea(n, x, y, w, h);
    });
    return npcs as MapObject[]; */

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
}
