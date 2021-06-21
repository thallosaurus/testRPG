interface ExportFile {
    width: number;
    height: number;
    spritesheet: string;
    spawnX: number;
    spawnY: number;
    mapped: Array<number | null>;
    objects: Array<number | null>;
}

window.onload = () => {
    let buf: Array<number | null> = [];
    document.querySelector("button#export")?.addEventListener("click", () => {
        document.querySelectorAll("div.box:not(.picker)").forEach(e => {
            buf.push((<any>e).addData.getTile());
        });

        let data: ExportFile = {
            width: 20,
            height: 20,
            spritesheet: "/assets/maps/test.png",
            spawnX: 4,
            spawnY: 4,
            mapped: buf,
            objects: [null]
        }

        console.log(JSON.stringify(data));
    });
    createTable();

    createPicker();
}
const SHEETWIDTH = 30;
const SHEETHEIGHT = 30;

function getPictureWidth() {
    return 32 * SHEETWIDTH;
}

function getPictureHeight() {
    return 32 * SHEETHEIGHT;
}

let mouseMode:any = 3;

function createTable(sel = "div#anchor") {
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
    document.querySelector(sel)?.appendChild(table);
}

function createPicker(sel = "div#picker") {
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
    document.querySelector(sel)?.appendChild(table);
}

function divOnclick() {

}

class Tile {
    private tiledata: number | null;
    div: HTMLDivElement = document.createElement("div");

    constructor(i: number | null) {
        this.div.classList.add('box');
        (<any>this.div).addData = this;
        this.tiledata = i;
        // if (getXYFromI(i) !== null) {
            this.setXY(getXYFromI(i)!);
        // }

        this.div.addEventListener("click", this.mouseHandler.bind(this));
    }

    public mouseHandler(event: any) {
        event.target.addData.setXY(getXYFromI(mouseMode));
        event.target.addData.setTile(mouseMode);
    }

    setTile(n: number | null) {
        this.tiledata = n;
    }

    getTile() : number | null {
        return this.tiledata;
    }

    setXY(a: Array<number> | null) {

        if (a !== null) {
            this.div.dataset.x = "" + (a[0] * 32);
            this.div.dataset.y = "" + (a[1] * 32);

            let xPerc = a[0] * 32 * -1;
            let yPerc = a[1] * 32 * -1;
            // console.log(xPerc, yPerc);

            this.div.classList.remove('empty');
            this.div.classList.add('sprite');

            this.div.dataset.x = "" + xPerc;
            this.div.dataset.y = "" + yPerc;
            
            // this.div.classList.('sprite');
            this.div.style.setProperty("background-position", `${xPerc}px ${yPerc}px`);
            // this.div.style.setProperty("background-color", "");
        } else {
            // this.div.style.setProperty("background-position", "");
            this.div.classList.add('empty');
            this.div.classList.remove('sprite');
            // this.div.style.setProperty("background-color", "black");
        }
    }

    getHTML() {
        return this.div;
    }
}

class Picker extends Tile {
    constructor(i: number | null) {
        super(i);
        this.div.classList.add("picker");
    }

    public mouseHandler(event: any) {
        // event.target.addData.setXY(getXYFromI(mouseMode));
        // event.target.addData.setTile(mouseMode);
        // debugger;
        document.querySelectorAll(".selected").forEach((e: any) => {
            e.classList.remove("selected");
        });

        this.div.classList.add("selected");
        mouseMode = this.getTile();
        console.log(mouseMode);
    }
}

function getXYFromI(i: number | null): Array<number> | null {
    if (i === null) return null;
    let x = i % SHEETWIDTH;
    let y = Math.floor(i / SHEETHEIGHT);

    return [x, y];
}