import { MultiplayerClient } from "../Client/SocketClient";
import { MapDrawable } from "../Interfaces/MapDrawable";
import { ImageLoader } from "../Interfaces/ResourceLoader";
import { BoardUpdate, KillEvent, LevelChangeEvent, NewPlayerEvent, PlayerJoinEvent, UpdateEvent } from "../Interfaces/ServerEvents";
import { GameMap } from "../Map/GameMap";
import { Character, PlayerDirection } from "../Map/MapObjects/Character";
import { Player } from "../Server/Player";
import { Mappable, SubMappable, WorldController } from "./WorldController";

export class CharacterController implements SubMappable, ImageLoader {

    // private ownPlayer!: Character;
    client: MultiplayerClient.Client = new MultiplayerClient.Client("ws://localhost:4000");
    // private ownPlayerId: string = "";

    getById(id: string): Character | null {
        // console.log(id);
        let element = this.characters.find((e: Character) => {
            return e.id === id;
        });

        return element ?? null;
    }

    get ownPlayer(): Character | null {
        // console.log(this.ownPlayerId);
        return this.getById(MultiplayerClient.Client.id);
    }

    getAllExceptOwn() {
        let c = this.characters.filter((e: Character) => {
            return e !== this.ownPlayer;
        });

        return c;
    }

    // otherClients: Array<Character> = [] ;

    getMapDataXY(x: number, y: number): MapDrawable | null {
        // throw new Error("Method not implemented.");
        // console.log(this.characters);
        let c = this.characters.find((e) => {
            return e.x === x && e.y === y;
        }) ?? null;

        // if (c !== null) console.log(c);

        return c;
    }

    /*     drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
            this.ownPlayer?.drawAt(ctx, 0, x, y, w, h);
        } */

    setAnimationProgressOfPlayer(ts: number) {
        this.ownPlayer?.setAnimationProgress(ts);
    }

    playerLookAt(dir: PlayerDirection) {
        this.ownPlayer?.lookAt(dir);
    }

    private characters: Array<Character> = [];

    constructor() {
        //this.characters.push(new Character(3, 3));
        // this.client.join();
        this.client.io.on("levelchange", async (msg: LevelChangeEvent) => {
            console.log(msg);
            let lvl = await GameMap.getLevel(msg.level);
            lvl.resolveResource();
            WorldController.map = lvl;
        });

        this.client.io.on("newplayer", (data: NewPlayerEvent) => {
            // console.log(data);
            console.log("Received data newplayer", data);
            /*             character.resolveResource();
                        // console.log("d", data);
                        if (data.id === MultiplayerClient.Client.id) {
                            console.log("Joining as normal Character");
                            this.ownPlayerId = data.id;
                        }
                        this.characters.push(character); */
            if (data.id === MultiplayerClient.Client.id) {
                WorldController.x_ = data.x;
                WorldController.y_ = data.y;
            }
            let character = new Character(data.id, data.x, data.y);
            character.resolveResource();

            // console.log("client id", MultiplayerClient.Client.id);
            /*             if (data.id === MultiplayerClient.Client.id) {
                            console.log("id");
                            this.ownPlayerId = data.id;
                        } */

            this.characters.push(character);
            // console.log(this.characters);
        });

        this.client.io.on("updateEvent", (data: UpdateEvent) => {
            this.getById(data.id)?.setXYDiff(data.x, data.y);
            if (this.getById(data.id) !== null) {

                this.getById(data.id)!.updatePending = false;
            }
        });

        this.client.io.on("hello", (data: BoardUpdate) => {
            console.log("hello", data);
            for (let p of data.players) {
                this.characters.push(new Character(p.id, p.x, p.y));
            }
/*             data.players.forEach(e => {
                console.log(e);
                this.characters.push(new Character(e.id, e.x, e.y));
                console.log("push", this.characters);
            }); */
            /*             this.getById(data.id)?.setXYDiff(data.x, data.y);
                        if (this.getById(data.id) !== null) {
            
                            this.getById(data.id)!.updatePending = false;
                        } */
        });

        this.client.io.on("kill", (data: KillEvent) => {
            console.log("KILLED " + data.id);
            let arrayObj = this.getById(data.id);
            this.characters = this.characters.filter((e) => {
                return e !== arrayObj;
            });
        });

        // this.client.send<PlayerJoinEvent>("playerjoin");
        // this.ownPlayer = new Character(this.client);
        this.resolveResource();
    }

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return new Promise<void>((res, rej) => {
            let intervalId = setInterval(() => {
                if (MultiplayerClient.Client.id === "") {
                    console.log("own player is not assigned");
                    // console.log(MultiplayerClient.Client.id);
                    // return new Promise((res, rej) => res());
                    return;
                } else {
                    // console.log(this.ownPlayerId);
                    clearInterval(intervalId);
                    this.ownPlayer!.resolveResource();
                    res();
                }
            }, 1000);
        });
    }
    unloadResource(): void {
        // throw new Error("Method not implemented.");
        this.ownPlayer!.unloadResource();
    }

    /*     allCharsUp() {
            this.characters.forEach(e => {
                e.moveUp(1);
            });
        }
        allCharsDown() {
            this.characters.forEach(e => {
                e.moveDown(1);
            });
        }
        allCharsLeft() {
            this.characters.forEach(e => {
                e.moveLeft(1);
            });
        }
        allCharsRight() {
            this.characters.forEach(e => {
                e.moveRight(1);
            }); */

}