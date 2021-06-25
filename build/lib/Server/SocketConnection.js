export class SocketConnection {
    constructor(socket) {
        SocketConnection.sockets.push(this);
        this.socket = socket;
        this.setupSocket();
        SocketConnection.sendToAllClients("playerjoin", {
            id: socket.id
        }, [this]);
    }
    setupSocket() {
        this.socket.on("disconnect", this.kill.bind(this));
    }
    kill() {
        SocketConnection.sockets = SocketConnection.sockets.filter(e => e !== this);
    }
    static sendToAllClients(tag, payload, exclude = null) {
        this.sockets
            .filter((e) => { var _a; return (_a = (exclude === null || exclude === void 0 ? void 0 : exclude.indexOf(e)) === -1) !== null && _a !== void 0 ? _a : true; })
            .map(e => {
            e.socket.emit(tag, payload);
        });
    }
}
SocketConnection.sockets = [];
//# sourceMappingURL=SocketConnection.js.map