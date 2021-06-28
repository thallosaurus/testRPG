export interface InputHandler {
    onKeyboardEvent(e: KeyboardEvent): void;
    onMouseEvent?(e: MouseEvent): void;
    onTouchEvent?(e: TouchEvent): void;
}