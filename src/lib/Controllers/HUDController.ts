import { Drawable } from "../Interfaces/Drawable";
import { InputHandler } from "../Interfaces/InputHandler";
import { ObjectRegistry } from "../ObjectRegistry";

export class HUDController implements Drawable, InputHandler {
    static hudIsOpen: boolean = false;

    constructor() {

    }

    onKeyboardEvent(e: KeyboardEvent): void {
        // throw new Error("Method not implemented.");
        if (!ObjectRegistry.interaction) {
            switch (e.key) {
                case "Escape":
                    HUDController.toggleMenu();
                    break;
            }
        }
    }

    redraw(ctx: CanvasRenderingContext2D, timestamp: number): void {
        
    }
    
    redrawDbg(ctx: CanvasRenderingContext2D, timestamp: number): void {
        if (HUDController.hudIsOpen) {
            ctx.font = "48px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("The HUD is open", 0, 100);
        }
    }

    static openMenu() {
        this.hudIsOpen = true;
    }

    static closeMenu() {
        this.hudIsOpen = false;
    }

    static toggleMenu() {
        this.hudIsOpen = !this.hudIsOpen;
    }
}