import { io } from 'socket.io-client';
export var MultiplayerClient;
(function (MultiplayerClient) {
    class Client {
        constructor(address) {
            this.io = io(address);
            this.join().then((data) => {
                this.id = data.id;
            }).catch(e => {
                console.error("Connection failed, " + e);
            });
        }
        join() {
            return this.send("playerjoin");
        }
        disconnect() {
            return this.send("disconnect");
        }
        send(tag, data) {
            return new Promise((res, rej) => {
                var _a;
                ((_a = this.io) === null || _a === void 0 ? void 0 : _a.once(tag, (data) => {
                    res(data);
                })) || rej("Connection not established");
                setTimeout(() => { rej("Timeout after 10 seconds"); }, 10000);
            });
        }
    }
    MultiplayerClient.Client = Client;
})(MultiplayerClient || (MultiplayerClient = {}));
//# sourceMappingURL=SocketClient.js.map