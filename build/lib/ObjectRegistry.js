var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Canvas from "./Controllers/CanvasController";
export class ObjectRegistry {
    static resolveAllSprites() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let res of ObjectRegistry.renderQueue.filter(objectIsResourceLoader)) {
                yield res.resolveResource();
            }
        });
    }
    static renderToContext(ctx, ts) {
        var _a;
        for (let r of ObjectRegistry.renderQueue.filter(objectIsDrawable)) {
            r.redraw(ctx, ts);
            Canvas.DEBUG && ((_a = r.redrawDbg) === null || _a === void 0 ? void 0 : _a.call(r, ctx, ts));
        }
    }
    static addToRenderQueue(elem) {
        ObjectRegistry.renderQueue.push(elem);
    }
    static setVisualOffset(x, y) {
        this.renderQueue.filter(objectIsVisualOffset).forEach(e => {
            e.setVisualOffsetX(x, 0);
            e.setVisualOffsetY(y, 0);
        });
    }
    static onInputEvent(e) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            f.onKeyboardEvent(e);
        });
    }
    static onTouchEvent(e) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            var _a, _b;
            (_b = (_a = f).onTouchEvent) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        });
    }
    static onMouseEvent(e) {
        this.renderQueue.filter(objectIsInputHandler).forEach(f => {
            var _a, _b;
            (_b = (_a = f).onMouseEvent) === null || _b === void 0 ? void 0 : _b.call(_a, e);
        });
    }
}
ObjectRegistry.renderQueue = [];
function objectIsDrawable(obj) {
    return 'redraw' in obj;
}
function objectIsResourceLoader(obj) {
    return 'resolveResource' in obj;
}
function objectIsVisualOffset(obj) {
    return 'setVisualOffsetX' in obj && 'setVisualOffsetY' in obj;
}
function objectIsInputHandler(obj) {
    return 'onKeyboardEvent' in obj;
}
//# sourceMappingURL=ObjectRegistry.js.map