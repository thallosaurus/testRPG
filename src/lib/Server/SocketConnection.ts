import { Socket } from "socket.io";
import { PlayerJoinEvent, UpdateEvent } from "../Interfaces/ServerEvents";
import { Player } from "./Player";

export abstract class SocketConnection {
    static sockets: SocketConnection[] = [];
    public id: string;

    readonly socket: Socket
    constructor(socket: Socket) {
        SocketConnection.sockets.push(this);

        this.socket = socket;
        this.setupSocket();

        this.id = socket.id;

        //        let exclude: Array<SocketConnection> = [this]
        SocketConnection.sendToAllClients("playerjoin", {
            id: socket.id
        } as PlayerJoinEvent, [this]);
    }

    setupSocket() {
        this.socket.on("disconnect", this.kill.bind(this));
    }

    public kill() {
        SocketConnection.sockets = SocketConnection.sockets.filter(e => e !== this);
        // this.sockets
    }

    public kickFromLevel() {
        let players = this.getPlayersInLevel();
        console.log("P", players);
        players.forEach(e => {
            e.socket.emit("kill", {
                id: this.id
            });
        })
    }

    public getPlayersInLevel() {
        if (!(this instanceof Player)) throw new Error("this is no player");
        return SocketConnection.sockets.filter((e) => {
            return e instanceof Player;
        }).filter((e) => {
            console.log(e);
            return (e as unknown as Player).level_ === (this as unknown as Player).level;
        })
    }

    public sendUpdate(u: any) {
        let obj = {
            from: this.id,
            type: typeof u,
            data: u
        }

        console.log(obj);
        this.getPlayersInLevel().map((e) => {e.socket.emit("updateEvent", u as UpdateEvent)});
    }

    static sendToAllClients(tag: string, payload: any, exclude: Array<SocketConnection> | null = null) {
        this.sockets
            // .filter((e) => {return exclude?.indexOf(e) === -1 ?? true})
            .map(e => {
                e.socket.emit(tag, payload);
            });
    }
}