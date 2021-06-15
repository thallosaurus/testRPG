import Canvas, { Drawable } from "./CanvasController.js";
import { ResourceLoader, World } from './Map.js';
import Player from "./Sprite.js";

export class ObjectRegistry {
  static renderQueue: Array<Drawable> = new Array<Drawable>();

  static canvasControllerId: number = -1;
  static worldId: number = -1;
  static playerId: number = -1;

  static get world(): World {
    return this.renderQueue[this.worldId] as World;
  }

  static get player(): Player {
    return this.renderQueue[this.playerId] as Player;
  }

  static get canvasController() : Canvas {
    return this.renderQueue[this.canvasControllerId] as Canvas;
  }

  static addToRenderQueue(obj: Drawable): number {
    if (obj instanceof World) this.worldId = this.renderQueue.length;
    if (obj instanceof Player) this.playerId = this.renderQueue.length;
    if (obj instanceof Canvas) this.canvasControllerId = this.renderQueue.length;
    this.renderQueue.push(obj);
    return this.renderQueue.length - 1;
    debugger;
  }

  static renderToContext(ctx: CanvasRenderingContext2D, timestamp: number) {
    for (let q of this.renderQueue) {
      q.redraw(ctx, timestamp);
    }
    // debugger;
  }

  static async resolveAllSprites(): Promise<void> {
    return new Promise(async (res, rej) => {
      for (let res of this.renderQueue.filter(this.instanceOfResourceLoader)) {
        await (res as unknown as ResourceLoader).resolveSprites();
      }
      res();
    });
  }

  static instanceOfResourceLoader(object: any): object is ResourceLoader {
  return 'resolveSprites' in object;
}
}
