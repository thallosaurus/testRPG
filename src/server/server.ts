import * as WebSocket from 'ws';
import * as express from 'express';
import * as http from 'http';

// const app = express();

// const server = http.createServer();

// const wss = new WebSocket.Server({ server });



export class WebSocketServer {
    private readonly wss: WebSocket.Server;
    private readonly httpServer: http.Server;
    private readonly express: express.Router;

    constructor(port = 8888) {
        this.express = express.Router();
        this.express.get("/", (req, res) => {
            res.send("ok");
        });
        this.httpServer = http.createServer();
        this.wss = new WebSocket.Server({ server: this.httpServer });

        this.wss.on('connection', this.onConnection.bind(this));
    }

    serverListen(port: number) {
        this.httpServer.listen(port, () => {
            console.log("listening on port " + port);
        });
    }

    onConnection(ws: WebSocket) {
        ws.on('message', (message: string) => {
            console.log(message);
            ws.send("echo " + message);
        });
    
        ws.send("hello");
    }
}