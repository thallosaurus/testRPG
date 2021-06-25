import { Socket } from "socket.io";
import { LevelChangeEvent, PlayerX, PlayerY } from "../Interfaces/ServerEvents";
//import { MultiplayerServer } from "./ServerMain";
import { SocketConnection } from "./SocketConnection";

export class Player extends SocketConnection {
    x_!: number;
    y_!: number;
    level_!: string;

    set level(s: string) {
        //check if the level is valid
        this.level_ = s;
        this.socket.emit("levelchange", {
            level: this.level
        } as LevelChangeEvent);
    }

    set x(x: number) {
        this.x_ = x;
        this.socket.emit("playery", {
            newY: this.y_
        } as PlayerY);
    }

    set y(y: number) {
        this.y_ = y;
        this.socket.emit("playerx", {
            newX: this.x_
        } as PlayerX);
    }

    constructor(socket: Socket) {
        super(socket);
        this.x = 4;
        this.y = 4;
        this.level = "/assets/levels/room0.json";
    }

    setupSocket() {
        super.setupSocket();
        this.socket.on("levelchange", (lev: LevelChangeEvent) => {
            this.level = lev.level;
        });

        this.socket.on("playerx", (xev: PlayerX) => {
            this.x = xev.newX;
        });

        this.socket.on("playery", (yev: PlayerY) => {
            this.y = yev.newY;
        });
    }
}