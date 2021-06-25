import { Server } from 'socket.io';
import http from 'http';
import { Player } from './Player';
export var MultiplayerServer;
(function (MultiplayerServer) {
    class ServerMain {
        constructor() {
            this.port = 4000;
            this.http = http.createServer();
            this.io = new Server(this.http);
            this.http.listen(this.port, () => {
                console.log("Socket Server is listening to Port " + this.port);
            });
        }
        setupSocket(io) {
            io.on("connection", (socket) => {
                socket.on("playerjoin", () => {
                    new Player(socket);
                });
            });
        }
    }
    MultiplayerServer.ServerMain = ServerMain;
})(MultiplayerServer || (MultiplayerServer = {}));
//# sourceMappingURL=ServerMain.js.map