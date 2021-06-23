// import { io } from "socket.io-client";

export class SocketConnection {
    static socketConnection: WebSocket;
    static async setupSockets() {
/*         this.socketConnection = await new Promise<WebSocket>((res, rej) => {
            let socket = new WebSocket("ws://localhost:80");
            socket.onopen = (e) => {
                console.log("connected");
                res(socket);
            }
            // socket.onmessage = this.onMessage.bind(this);
        }); */

/*         let socketio = io("localhost:8080");
        socketio.emit("msg"); */
    }

    static send(eventname: string) {
/*         return new Promise<Blob>((res, rej) => {
            this.socketConnection.send(eventname);
            this.socketConnection.onmessage = (msg) => {
                res(msg.data);
                // res(Array.of((msg.data as Blob).arrayBuffer()));
                
            };
        }); */
    }

    static onMessage(e: MessageEvent) {
        console.log(e);
    }

    static async getPlayersOnMap(mapname:string) {
        // return this.send("playersOnMap");
    }
}

interface Socket {

}