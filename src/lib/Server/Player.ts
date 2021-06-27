import { Socket } from "socket.io";
import { KillEvent, LevelChangeEvent, PlayerX, PlayerY, PositionUpdate } from "../Interfaces/ServerEvents";
import { MultiplayerServer } from "./ServerMain";
import { SocketConnection } from "./SocketConnection";

export class Player extends SocketConnection {
    x_: number = 3;
    y_: number = 6;
    level_!: string;
    id!: string;
    parent: MultiplayerServer.ServerMain;

    set level(s: string) {
        this.level_ = s;
        this.socket.emit("levelchange", {
            level: s
        } as LevelChangeEvent);
    }

    set x(x: number) {
        this.x_ += x;
        console.log(x, this.x_);
        
    }
    
    get x() {
        console.log("get x", this.x_);
        return this.x_;
    }
    get y() {
        console.log("get y", this.y_);
        return this.y_;
    }
    
    set y(y: number) {
        this.y_ += y;
        console.log(y, this.y_);
    }

    constructor(socket: Socket, parent: MultiplayerServer.ServerMain) {
        super(socket);
        this.parent = parent;
        this.id = socket.id;
        console.log("socket constructor");
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
            console.log("lev" + lev);
            this.level = lev.level;
        });

        this.socket.on("posupdate", (pos: PositionUpdate) => {
            console.log("POS", pos);
            this.x_ = pos.x;
            this.y_ = pos.y;
            this.parent.emit("posupdate", {
                id: pos.id,
                x: pos.x,
                y: pos.y
            });
        });
    }
}