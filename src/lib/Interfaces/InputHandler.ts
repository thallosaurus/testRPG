export interface InputHandler {
    onKeyboardEvent(e: KeyboardEvent): Promise<void>;
    onMouseEvent?(e: MouseEvent): void;
    onTouchEvent?(e: TouchEvent): void;
}