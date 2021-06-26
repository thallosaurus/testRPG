import { Server, Socket } from 'socket.io';
import http from 'http';
import { Player } from './Player';

export namespace MultiplayerServer {
    export class ServerMain {
        private readonly http
        private readonly io: Server;
        private readonly port: number = 4000;
        constructor() {
            this.http = http.createServer();
            this.io = new Server(this.http);

            this.setupSocket(this.io);

            this.http.listen(this.port, () => {
                console.log("Socket Server is listening to Port " + this.port);
            });
        }

        private setupSocket(io: Server) {
            io.on("connection", (socket: Socket) => {
                socket.on("playerjoin", () => {
                    new Player(socket);
                });
            });
        }
    }
    new ServerMain();
}
