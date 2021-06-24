export interface VisualOffset {
    hasActiveEvent: boolean;
    setVisualOffsetX(x: number, ts: number):void;
    setVisualOffsetY(y: number, ts: number):void;
    getVisualOffsetX():number;
    getVisualOffsetY():number;

    finalizeX(pos:boolean, amount: number):void;
    finalizeY(pos:boolean, amount: number):void;
}