// import { Drawable } from "./Controllers/CanvasController";

import Canvas from "./Controllers/CanvasController.js";
import { Drawable } from "./Interfaces/Drawable.js";
import { InputHandler } from "./Interfaces/InputHandler.js";
import { ResourceLoader } from "./Interfaces/ResourceLoader.js";
import { VisualOffset } from "./Interfaces/VisualOffset.js";

export class ObjectRegistry {
    static renderQueue: Drawable[] = [];

    static async resolveAllSprites() {
        // throw new Error("Method not implemented.");
        for (let res of ObjectRegistry.renderQueue.filter(objectIsResourceLoader)) {
            await (res as unknown as ResourceLoader).resolveResource();
        }
    }
    static renderToContext(ctx: CanvasRenderingContext2D, ts: number) {
        // throw new Error("Method not implemented.");
        for (let r of ObjectRegistry.renderQueue.filter(objectIsDrawable)) {
            r.redraw(ctx, ts);
            Canvas.DEBUG && r.redrawDbg?.(ctx, ts);
        }
    }

    static addToRenderQueue(elem: Drawable) {
        ObjectRegistry.renderQueue.push(elem);
    }

    static setVisualOffset(x: number, y: number) {
        this.renderQueue.filter(objectIsVisualOffset).forEach(e => {
            (e as unknown as VisualOffset).setVisualOffsetX(x);
            (e as unknown as VisualOffset).setVisualOffsetY(y);
        });
    }

    static onInputEvent(e: KeyboardEvent) {
        // console.log(e);
        // console.log(this.renderQueue);
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            (f as unknown as InputHandler).onKeyboardEvent(e);
        });
    }
}

function objectIsDrawable(obj: any): obj is Drawable {
    return 'redraw' in obj;
}

function objectIsResourceLoader(obj: any): obj is ResourceLoader {
    return 'resolveResource' in obj;
}

function objectIsVisualOffset(obj: any): obj is VisualOffset {
    return 'setVisualOffsetX' in obj && 'setVisualOffsetY' in obj;
}

function objectIsInputHandler(obj: any): obj is InputHandler {
    return 'onKeyboardEvent' in obj;
}