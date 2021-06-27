export namespace MapUtils {
    export function getXY(i: number, w: number, h: number) {
        let x = i % w;
        let y = Math.floor(i / h);
        return { x: x, y: y } as Vector2D;
    }

    export function getI(x: number, y: number, w: number): number {
        // return getArrayIndexFromInt(x, y, x);
        return (y * w) + x;
    }

    export function indexToColor(i: number) : string {
        switch (i % 6) {
            case 0:
                return "green";
            case 1:
                return "yellow";
            case 2:
                return "purple";
            case 3:
                return "blue";
            case 4:
                return "pink";
            case 5:
                return "red";
            case 6:
                return "white";
            }

            return "grey";
    }

    export function getFromURL(param: string) {
        let u = new URLSearchParams(location.search);
        return u.get(param);
    }

    export function getDifference(x1:number, y1:number, x2:number, y2:number): Vector2D {
        return {
            x: x1 - x2,
            y: y1 - y2
        } as Vector2D;
    }

    export interface Vector2D {
        x: number;
        y: number;
    }
}