"use strict";
window.onload = () => {
    var _a;
    let buf = [];
    (_a = document.querySelector("button#export")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        document.querySelectorAll("div.box:not(.picker)").forEach(e => {
            buf.push(e.addData.getTile());
        });
        let data = {
            width: 20,
            height: 20,
            spritesheet: "/assets/maps/test.png",
            spawnX: 4,
            spawnY: 4,
            mapped: buf,
            objects: [null]
        };
        console.log(JSON.stringify(data));
    });
    createTable();
    createPicker();
};
const SHEETWIDTH = 30;
const SHEETHEIGHT = 30;
function getPictureWidth() {
    return 32 * SHEETWIDTH;
}
function getPictureHeight() {
    return 32 * SHEETHEIGHT;
}
let mouseMode = 3;
function createTable(sel = "div#anchor") {
    var _a;
    let width = 20;
    let height = 20;
    let table = document.createElement("table");
    for (let y = 0; y < height; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < width; x++) {
            let td = document.createElement("td");
            td.append(new Tile(null).getHTML());
            row.append(td);
        }
        table.append(row);
    }
    (_a = document.querySelector(sel)) === null || _a === void 0 ? void 0 : _a.appendChild(table);
}
function createPicker(sel = "div#picker") {
    var _a;
    let total = SHEETWIDTH * SHEETHEIGHT;
    let i = 0;
    let table = document.createElement("table");
    for (let y = 0; y < SHEETHEIGHT; y++) {
        let row = document.createElement("tr");
        for (let x = 0; x < SHEETWIDTH; x++) {
            let td = document.createElement("td");
            td.append(new Picker(i).getHTML());
            row.append(td);
            i++;
        }
        table.append(row);
    }
    (_a = document.querySelector(sel)) === null || _a === void 0 ? void 0 : _a.appendChild(table);
}
function divOnclick() {
}
class Tile {
    constructor(i) {
        this.div = document.createElement("div");
        this.div.classList.add('box');
        this.div.addData = this;
        this.tiledata = i;
        this.setXY(getXYFromI(i));
        this.div.addEventListener("click", this.mouseHandler.bind(this));
    }
    mouseHandler(event) {
        event.target.addData.setXY(getXYFromI(mouseMode));
        event.target.addData.setTile(mouseMode);
    }
    setTile(n) {
        this.tiledata = n;
    }
    getTile() {
        return this.tiledata;
    }
    setXY(a) {
        if (a !== null) {
            this.div.dataset.x = "" + (a[0] * 32);
            this.div.dataset.y = "" + (a[1] * 32);
            let xPerc = a[0] * 32 * -1;
            let yPerc = a[1] * 32 * -1;
            this.div.classList.remove('empty');
            this.div.classList.add('sprite');
            this.div.dataset.x = "" + xPerc;
            this.div.dataset.y = "" + yPerc;
            this.div.style.setProperty("background-position", `${xPerc}px ${yPerc}px`);
        }
        else {
            this.div.classList.add('empty');
            this.div.classList.remove('sprite');
        }
    }
    getHTML() {
        return this.div;
    }
}
class Picker extends Tile {
    constructor(i) {
        super(i);
        this.div.classList.add("picker");
    }
    mouseHandler(event) {
        document.querySelectorAll(".selected").forEach((e) => {
            e.classList.remove("selected");
        });
        this.div.classList.add("selected");
        mouseMode = this.getTile();
        console.log(mouseMode);
    }
}
function getXYFromI(i) {
    if (i === null)
        return null;
    let x = i % SHEETWIDTH;
    let y = Math.floor(i / SHEETHEIGHT);
    return [x, y];
}
//# sourceMappingURL=mapper.js.map