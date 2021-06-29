export interface InputHandler {
    onKeyboardEvent?(e: KeyboardEvent): void;
    onMouseEvent?(e: MouseEvent): void;
    onTouchEvent?(e: TouchEvent): void;

    onTouchStartEvent?(e: TouchEvent): void,
    onTouchMoveEvent?(e: TouchEvent): void;
    onTouchEndEvent?(e: TouchEvent): void;
}