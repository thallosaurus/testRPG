export interface VisualOffset {
    hasActiveEvent: boolean;
    setVisualOffsetX(x: number):void;
    setVisualOffsetY(y: number):void;
    getVisualOffsetX():number;
    getVisualOffsetY():number;

    finalizeX(pos:boolean):void;
    finalizeY(pos:boolean):void;
}