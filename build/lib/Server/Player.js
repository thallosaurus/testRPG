import { SocketConnection } from "./SocketConnection";
export class Player extends SocketConnection {
    constructor(socket) {
        super(socket);
        this.x = 4;
        this.y = 4;
        this.level = "/assets/levels/room0.json";
    }
    set level(s) {
        this.level_ = s;
        this.socket.emit("levelchange", {
            level: this.level
        });
    }
    set x(x) {
        this.x_ = x;
        this.socket.emit("playery", {
            newY: this.y_
        });
    }
    set y(y) {
        this.y_ = y;
        this.socket.emit("playerx", {
            newX: this.x_
        });
    }
    setupSocket() {
        super.setupSocket();
        this.socket.on("levelchange", (lev) => {
            this.level = lev.level;
        });
        this.socket.on("playerx", (xev) => {
            this.x = xev.newX;
        });
        this.socket.on("playery", (yev) => {
            this.y = yev.newY;
        });
    }
}
//# sourceMappingURL=Player.js.map