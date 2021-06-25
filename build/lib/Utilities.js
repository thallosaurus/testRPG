export var MapUtils;
(function (MapUtils) {
    function getXY(i, w, h) {
        let x = i % w;
        let y = Math.floor(i / h);
        return { x: x, y: y };
    }
    MapUtils.getXY = getXY;
    function getI(x, y, w) {
        return (y * w) + x;
    }
    MapUtils.getI = getI;
    function indexToColor(i) {
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
    MapUtils.indexToColor = indexToColor;
})(MapUtils || (MapUtils = {}));
//# sourceMappingURL=Utilities.js.map