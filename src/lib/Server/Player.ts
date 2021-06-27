import { Socket } from "socket.io";
import { KillEvent, LevelChangeEvent, PlayerX, PlayerY } from "../Interfaces/ServerEvents";
import { MultiplayerServer } from "./ServerMain";
//import { MultiplayerServer } from "./ServerMain";
import { SocketConnection } from "./SocketConnection";

export class Player extends SocketConnection {
    x_: number = 0;
    y_: number = 0;
    level_!: string;
    id!: string;
    parent: MultiplayerServer.ServerMain;

    set level(s: string) {
        //check if the level is valid
        this.level_ = s;
        this.socket.emit("levelchange", {
            level: s
        } as LevelChangeEvent);
    }

    set x(x: number) {
        this.x_ += x;
        this.sendUpdate({
            id: this.id,
            x: x,
            y: 0
        });

        console.log(x);
    }

    set y(y: number) {
        this.y_ += y;
        this.sendUpdate({
            id: this.id,
            x: 0,
            y: y
        });
    }

    constructor(socket: Socket, parent: MultiplayerServer.ServerMain) {
        super(socket);
        this.parent = parent;
        this.id = socket.id;
        console.log("socket constructor");
/*         this.x_ = 0;
        this.y_ = 0; */
        this.level = "/assets/levels/room0.json";
    }

    public kill() {
        console.log("bye", this.id);
        super.kill();
        this.parent.kill(this);
    }

    setupSocket() {
        super.setupSocket();
        this.socket.on("levelchange", (lev: LevelChangeEvent) => {
            console.log(lev);
            this.level = lev.level;
        });

        this.socket.on("playerx", (xev: PlayerX) => {
            console.log("xev", xev);
            this.x = xev.newX;
        });
        
        this.socket.on("playery", (yev: PlayerY) => {
            console.log("yev", yev);
            this.y = yev.newY;
        });
    }
}