import { Socket } from "socket.io";
import { PlayerJoinEvent } from "../Interfaces/ServerEvents";

export abstract class SocketConnection {
    static sockets: SocketConnection[] = [];

    readonly socket: Socket
    constructor(socket: Socket) {
        SocketConnection.sockets.push(this);

        this.socket = socket;
        this.setupSocket();

//        let exclude: Array<SocketConnection> = [this]
        SocketConnection.sendToAllClients("playerjoin", {
            id: socket.id
        } as PlayerJoinEvent, [this]);
    }

    setupSocket() {
        this.socket.on("disconnect", this.kill.bind(this));
    }

    private kill() {
        SocketConnection.sockets = SocketConnection.sockets.filter(e => e !== this);
    }

    static sendToAllClients(tag: string, payload: any, exclude: Array<SocketConnection> | null = null) {
        this.sockets
        .filter((e) => {return exclude?.indexOf(e) === -1 ?? true})
        .map(e => {
            e.socket.emit(tag, payload);
        });
    }
}