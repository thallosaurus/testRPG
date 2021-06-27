import { exception, time } from 'console';
import { io, Socket } from 'socket.io-client';
import { PlayerJoinEvent, PlayerX, PlayerY } from '../Interfaces/ServerEvents';
import { Player } from '../Server/Player';

export namespace MultiplayerClient {
    export class Client {
        private readonly socket: Socket;
        static id: string;

        private x!: number;
        private y!: number;

        get io() {
            return this.socket;
        }

        constructor(address: string) {
            this.socket = io(address);
            // debugger;
            this.join().then((id: string) => {
                // console.log("Join, this is my id: ", id);
                MultiplayerClient.Client.id = id;
                // console.log(MultiplayerClient.Client.id);
            });
        }

        join(): Promise<string> {
            console.log("Sending Join Event");
            return this.send<PlayerJoinEvent>("playerjoin").then((e: PlayerJoinEvent) => {
                return e.id;
            });
        }
        
        disconnect() {
            return this.send<void>("disconnect");
        }
        
        send<T>(tag: string, data?: T) : Promise<T> {
            return new Promise<T>((res, rej) => {
                // let timeout = setTimeout(() => {rej("Timeout after 10 seconds")}, 10000);
                this.socket?.once(tag, (data: T) => {
                    // clearTimeout(timeout);
                    res(data as T);
                }) || rej("Connection not established");
                
                // console.log(this.socket);
                this.socket?.emit(tag, data);

            });
        }
    }
}