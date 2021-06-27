import { Client } from "socket.io/dist/client";
import { MultiplayerClient } from "../Client/SocketClient";
import { MapDrawable } from "../Interfaces/MapDrawable";
import { ImageLoader } from "../Interfaces/ResourceLoader";
import { BoardUpdate, KillEvent, LevelChangeEvent, NewPlayerEvent, PlayerJoinEvent, PositionUpdate, UpdateEvent } from "../Interfaces/ServerEvents";
import { GameMap } from "../Map/GameMap";
import { Character, PlayerDirection } from "../Map/MapObjects/Character";
import { Player } from "../Server/Player";
import { MapUtils } from "../Utilities";
import { AnimationController } from "./AnimationController";
import { Mappable, SubMappable, WorldController } from "./WorldController";

export class CharacterController implements SubMappable, ImageLoader {

    // private ownPlayer!: Character;
    client: MultiplayerClient.Client = new MultiplayerClient.Client();
    parent!: WorldController;
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
        this.client.io.on("levelchange", async (msg: LevelChangeEvent) => {
            console.log(msg);
            let lvl = await GameMap.getLevel(msg.level);
            lvl.resolveResource();
            WorldController.map = lvl;
        });

        this.client.io.on("newplayer", (data: NewPlayerEvent) => {
            // console.log(data);
            let int = setInterval(() => {
                // alert("Received data newplayer, own id: " + MultiplayerClient.Client.id);
                if (data.id === MultiplayerClient.Client.id) {
                    WorldController.x_ = data.x;
                    WorldController.y_ = data.y;
                }
                let character = new Character(data.id, data.x, data.y);
                character.resolveResource();

                this.characters.push(character);
                clearInterval(int);
            }, 100);
        });

        this.client.io.on("posupdate", (data: UpdateEvent) => {
            let c = this.getById(data.id);
            if (c) {
                let diff = MapUtils.getDifference(data.x, data.y, c.x, c.y);

                console.log("Difference", diff, data);

                if (diff.y !== 0) {
                    // alert("y");
                    if (diff.y === -1) {
                        // console.log("y-up");
                        // if (AnimationController)
                        if (data.id === MultiplayerClient.Client.id) {
                            // AnimationController.scheduleMapMoveAnimation(this.parent, "y", true, 1);
                        } else {
                            // AnimationController.scheduleMapMoveAnimation(c, "y", true, 1);
                        }
                    } else {
                        // console.log("y-down");
                        
                        if (data.id === MultiplayerClient.Client.id) {
                            // AnimationController.scheduleMapMoveAnimation(this.parent, "y", false, 1);
                        } else {
                            // AnimationController.scheduleMapMoveAnimation(c, "y", false, 1);
                        }
                    }
                    //it is a y manipulation
                    // AnimationController.scheduleMapMoveAnimation(c, "y", diff.x > 0);
                    // if (data.id === MultiplayerClient.Client.id) AnimationController.scheduleMapMoveAnimation(this.parent, "y", diff.x < 0);
                } else {
                    if (diff.x === -1) {
                        // console.log("x-left");
                    } else {
                        // console.log("x-right");
                    }
                    //it is a x manipulation
                    // AnimationController.scheduleMapMoveAnimation(c, "x", diff.y > 0);
                    // if (data.id === MultiplayerClient.Client.id) AnimationController.scheduleMapMoveAnimation(this.parent, "x", diff.x < 0);
                }
                if (data.id === MultiplayerClient.Client.id) {
                    WorldController.x_ += diff.x;
                    WorldController.y_ += diff.y;
                }
                console.log("posupdate", data);
                c.setX(data.x);
                c.setY(data.y);

            }
            /*             if (this.getById(data.id) !== null) {
            
                            this.getById(data.id)!.updatePending = false;
                        } */
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
        /* 
                this.client.io.on("posupdate", (data: PositionUpdate) => {
                    console.log("posupdate", data);
                }) */

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

    setParent(wc: WorldController) {
        this.parent = wc;
    }

    resolveResource(): Promise<void> {
        // throw new Error("Method not implemented.");
        return new Promise<void>((res, rej) => {
            res();
        });
    }
    unloadResource(): void {
        // throw new Error("Method not implemented.");
        this.ownPlayer!.unloadResource();
    }

    moveOwnUp() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x,
                y: this.ownPlayer.y - 1
            });
        }
    }

    moveOwnDown() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x,
                y: this.ownPlayer.y + 1
            });
        }
    }

    moveOwnLeft() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x - 1,
                y: this.ownPlayer.y
            });
        }
    }

    moveOwnRight() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x + 1,
                y: this.ownPlayer.y
            });
        }
    }
}