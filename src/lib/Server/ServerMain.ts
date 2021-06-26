import { Server, Socket } from 'socket.io';
import http from 'http';
import { Player } from './Player';
import express from 'express';

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
                socket.on("playerjoin", () => {
                    new Player(socket);
                });
            });
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
                res.sendFile("./devassets/index.html", { root: __dirname + "/.."});
            });

            this.expressApp.get("/manifest.webmanifest", (req, res) => {
                res.send(WEBMANIFEST);
            });
        }
    }

    console.log(__dirname);
    new ServerMain();
}
