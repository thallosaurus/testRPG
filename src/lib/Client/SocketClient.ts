import { exception } from 'console';
import { io, Socket } from 'socket.io-client';
import { PlayerJoinEvent, PlayerX, PlayerY } from '../Interfaces/ServerEvents';

export namespace MultiplayerClient {
    export class Client {
        private readonly io?: Socket;
        private id?: string;

        private x!: number;
        private y!: number;

        constructor(address: string) {
            this.io = io(address);
            this.join().then((data: PlayerJoinEvent) => {
                this.id = data.id;
            }).catch(e => {
                console.error("Connection failed, " + e);
                //this.io = null;
                this.io?.close();
                //throw new Error(e);
            });
        }

        join() {
            return this.send<PlayerJoinEvent>("playerjoin");
        }

        
        
        disconnect() {
            return this.send<void>("disconnect");
        }
        
        send<T>(tag: string, data?: T) : Promise<T> {
            return new Promise<T>((res, rej) => {
                this.io?.once(tag, (data: T) => {
                    res(data);
                }) || rej("Connection not established");

                setTimeout(() => {rej("Timeout after 10 seconds")}, 10000);
            });
        }
    }
}