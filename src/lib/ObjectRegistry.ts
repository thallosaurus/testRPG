// import { Drawable } from "./Controllers/CanvasController";

import Canvas from "./Controllers/CanvasController";
import { Drawable } from "./Interfaces/Drawable";
import { InputHandler } from "./Interfaces/InputHandler";
import { ResourceLoader } from "./Interfaces/ResourceLoader";
import { VisualOffset } from "./Interfaces/VisualOffset";

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
            (e as unknown as VisualOffset).setVisualOffsetX(x, 0);
            (e as unknown as VisualOffset).setVisualOffsetY(y, 0);
        });
    }

    static onInputEvent(e: KeyboardEvent) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            (f as unknown as InputHandler).onKeyboardEvent(e);
        });
    }

    static onTouchEvent(e: TouchEvent) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            (f as unknown as InputHandler).onTouchEvent?.(e);
        });
    }

    static onMouseEvent(e: MouseEvent) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            (f as unknown as InputHandler).onMouseEvent?.(e);
        });
    }

/*     static passToSocketSubscriber(event: MessageEvent): void {
        this.renderQueue
        .filter(objectIsSocketSubscriber).
        filter(e => {
            return true; /* (e as unknown as SocketSubscriber).messageId *
        }).forEach(s => {
            (s as unknown as SocketSubscriber).onmessage(event);
        });
    } */
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

/* function objectIsSocketSubscriber(obj: any): obj is SocketSubscriber {
    return 'onmessage' in obj;
} */