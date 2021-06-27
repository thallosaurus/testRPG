import { Server, Socket } from 'socket.io';
import http from 'http';
import { Player } from './Player';
import express from 'express';
import { BoardUpdate, ClientJoinEvent, KillEvent, NewPlayerEvent, PositionUpdate, UpdateEvent } from '../Interfaces/ServerEvents';
import { threadId } from 'worker_threads';

export namespace MultiplayerServer {
    const WEBMANIFEST = {
        "dir": "ltr",
        "lang": "en-US",
        "name": "schrottimon",
        "short_name": "schrottimon",
        "description": "schrottimon",
        "icons": [{
            "src": "/assets/icon_512.png",
            "type": "image/png",
            "sizes": "512x512"
        }],
        "background_color": "#000000",
        "theme_color": "#000000",
        "display": "standalone",
        "orientation": "landscape-primary"
    }

    export class ServerMain {
        private readonly http
        private readonly io: Server;
        private readonly port: number = 4000;
        private readonly expressApp: express.Application;
        private connections: Array<Player> = [];

        constructor() {
            this.expressApp = express();
            this.http = http.createServer(this.expressApp);
            this.io = new Server(this.http);
            this.setupSocket(this.io);
            process.chdir("..");
            this.setupRoutes();

            this.http.listen(this.port, () => {
                console.log("Socket Server is listening to Port " + this.port);
            });
        }

        private setupSocket(io: Server) {
            io.on("connection", (socket: Socket) => {
                console.log("Someone connected");
                socket.on("clientjoin", (msg: void) => {
                    console.log("Player Joined");
                    let data = {
                        id: socket.id,
                        x: 4,
                        y: 6
                    } as NewPlayerEvent;

                    let player = new Player(socket, this);
                    this.connections.push(player);
                    socket.emit("clientjoin", {
                        id: socket.id
                    } as ClientJoinEvent)

                    this.connections.forEach((e) => {
                        e.socket.emit("newplayer", data);
                    });

                    console.log(this.connections);

                    let buf: PositionUpdate[] = [];
                    this.connections.filter((e) => {
                        return e.id !== socket.id
                    }).forEach((e) => {
                        console.log("buffer", e.x, e.y);
                        buf.push({
                            id: e.id,
                            x: e.x_,
                            y: e.y_
                        });
                    });

                    console.log("Players", buf);
                    socket.emit("hello", {
                        players: buf
                    });
                });


                /*
                let buf: PositionUpdate[] = [];
                this.connections.forEach((e) => {
                    console.log("buffer", e.x, e.y);
                    buf.push({
                        id: e.id,
                        x: e.x_,
                        y: e.y_
                    });
                });
                // socket.emit("playerjoin", data);
                
                console.log("bbbb", buf);
                socket.emit("hello", {
                    players: buf
                    ]
                });
                
                // socket.emit("hello", JSON.stringify(this.connections));
                
/*                     socket.emit("boardupdate", {
                    players: this.connections
                }); *
            }); */
            });
        }

        public kill(p: Player) {
            this.connections = this.connections.filter(e => {
                return e !== p;
            });

            this.connections.forEach(e => {
                e.socket.emit("kill", { id: p.id } as KillEvent);
            });
        }

        public emit(tag: string, data: any) {
            this.io.emit(tag, data);
        }

        private setupRoutes() {
            this.expressApp.get("/main.js", (req: express.Request, res: express.Response, next) => {
                console.log("[DEVSERVER] Sending main client bundle");
                res.sendFile("client.bundle.js", { root: __dirname });
                // res.sendFile("client.bundle.js");
            });

            this.expressApp.use("/assets", (req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log(`[DEVSERVER] Sending Sprite ${req.originalUrl}`);
                next();
            }, express.static(__dirname + "/../assets"));

            this.expressApp.use("/src", (req: express.Request, res: express.Response, next: express.NextFunction) => {
                console.log(`[DEVSERVER] Sending Source ${req.originalUrl}`);
                next();
            }, express.static(__dirname + "/../src"));

            this.expressApp.get("/", (req: express.Request, res: express.Response) => {
                console.log(__dirname);
                res.sendFile("./devassets/index.html", { root: __dirname + "/.." });
            });

            this.expressApp.get("/manifest.webmanifest", (req, res) => {
                res.send(WEBMANIFEST);
            });

            this.expressApp.get("/client.bundle.js.map", (req: express.Request, res: express.Response, next) => {
                res.sendFile("client.bundle.js.map", { root: __dirname });
                console.log("[DEVSERVER] Sending main client bundle Sourcemap");
                // res.sendFile("client.bundle.js");
            });
        }
    }

    console.log(__dirname);
    new ServerMain();
}
