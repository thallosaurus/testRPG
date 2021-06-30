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
    
    export function delta(n1: number, n2: number): number {
        return Math.abs(n1 - n2);
    }

    export function sign(n: number): number {
        if (n === 0) return 1;
        return Math.sign(n);
    }

    export function scale(val: number, min1:number, max1:number, min2: number, max2: number) {
        return ((min2 - min1) / (max2 - max1)) * val;
    }

    export function scale2(val:number, x1: number, x2:number) {
        return (x2 - x1) * val;
    }

    export interface Vector2D {
        x: number;
        y: number;
    }
}

export namespace LoginUtils {
    export function isValidInput(u: string | null, p?: string | null) {
        return (u !== "") && (u !== undefined)
            && (p !== "") && (p !== undefined)
    }
}