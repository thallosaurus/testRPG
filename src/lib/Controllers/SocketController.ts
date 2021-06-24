import { SocketSubscriber } from "../Interfaces/SocketSubscriber.js";
import { ObjectRegistry } from "../ObjectRegistry.js";

export class SocketController {
    socket: WebSocket;
    subs: Array<SocketSubscriber> = [];
    constructor() {
        this.socket = new WebSocket("ws://localhost");
        this.socket.onmessage = this.onmessage.bind(this);
    }

    onmessage(event: MessageEvent) {
        ObjectRegistry.passToSocketSubscriber(event);
    }
}