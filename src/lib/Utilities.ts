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

    export interface Vector2D {
        x: number;
        y: number;
    }
}