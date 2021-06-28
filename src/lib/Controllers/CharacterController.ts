import { MultiplayerClient } from "../Client/SocketClient";
import { MapDrawable } from "../Interfaces/MapDrawable";
import { ImageLoader } from "../Interfaces/ResourceLoader";
import { BoardUpdate, KillEvent, LevelChangeEvent, NewPlayerEvent, PositionUpdate, UpdateEvent, ErrorEvent } from "../Interfaces/ServerEvents";
import { GameMap } from "../Map/GameMap";
import { Character, PlayerDirection } from "../Map/MapObjects/Character";
import { ObjectRegistry } from "../ObjectRegistry";
import { MapUtils } from "../Utilities";
import { AnimationController } from "./AnimationController";
import { SubMappable, WorldController } from "./WorldController";

export class CharacterController implements SubMappable, ImageLoader {
    client: MultiplayerClient.Client = new MultiplayerClient.Client();
    parent!: WorldController;

    getById(id: string): Character | null {
        let element = this.characters.find((e: Character) => {
            return e.id === id;
        });

        return element ?? null;
    }

    get ownPlayer(): Character | null {
        return this.getById(MultiplayerClient.Client.id);
    }

    getAllExceptOwn() {
        let c = this.characters.filter((e: Character) => {
            return e !== this.ownPlayer;
        });

        return c;
    }

    getMapDataXY(x: number, y: number): MapDrawable | null {
        let c = this.characters.find((e) => {
            return e.x === x && e.y === y;
        }) ?? null;

        return c;
    }

    setAnimationProgressOfPlayer(ts: number) {
        this.ownPlayer?.setAnimationProgress(ts);
    }

    private characters: Array<Character> = [];

    constructor() {
        this.client.io.on("error", (msg: ErrorEvent) => {
            // console.log(msg);
            alert(`An error occured!\n\n${msg.msg}\n\n${msg.desc}`)
        });

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

                if (diff.y !== 0) {
                    if (diff.y === -1) {
                        c.lookAt(PlayerDirection.UP);
                        if (data.id === MultiplayerClient.Client.id) {
                            AnimationController.scheduleMapMoveAnimation(this.parent, PlayerDirection.UP);
                            
                        } else {
                            AnimationController.scheduleMapMoveAnimation(c, PlayerDirection.DOWN);
                            
                        }
                    } else {
                        c.lookAt(PlayerDirection.DOWN);
                        
                        if (data.id === MultiplayerClient.Client.id) {
                            AnimationController.scheduleMapMoveAnimation(this.parent, PlayerDirection.DOWN);
                        } else {
                            AnimationController.scheduleMapMoveAnimation(c, PlayerDirection.UP);
                        }
                    }
                } else {
                    if (diff.x === -1) {
                        c.lookAt(PlayerDirection.LEFT);
                        if (data.id === MultiplayerClient.Client.id) {
                            AnimationController.scheduleMapMoveAnimation(this.parent, PlayerDirection.LEFT);
                        } else {
                            AnimationController.scheduleMapMoveAnimation(c, PlayerDirection.RIGHT);
                        }
                    } else {
                        c.lookAt(PlayerDirection.RIGHT);
                        
                        if (data.id === MultiplayerClient.Client.id) {
                            AnimationController.scheduleMapMoveAnimation(this.parent, PlayerDirection.RIGHT);
                        } else {
                            AnimationController.scheduleMapMoveAnimation(c, PlayerDirection.LEFT);
                        }
                    }
                }

                if (data.id === MultiplayerClient.Client.id) {
                    WorldController.x_ += diff.x;
                    WorldController.y_ += diff.y;
                    ObjectRegistry.disableInteraction();
                }
                console.log("posupdate", data);
                c.setX(data.x);
                c.setY(data.y);
            }
        });

        this.client.io.on("hello", (data: BoardUpdate) => {
            console.log("hello", data);
            for (let p of data.players) {
                this.characters.push(new Character(p.id, p.x, p.y));
            }
        });

        this.client.io.on("kill", (data: KillEvent) => {
            console.log("KILLED " + data.id);
            let arrayObj = this.getById(data.id);
            this.characters = this.characters.filter((e) => {
                return e !== arrayObj;
            });
        });
        this.resolveResource();
    }

    setParent(wc: WorldController) {
        this.parent = wc;
    }

    resolveResource(): Promise<void> {
        return new Promise<void>((res, rej) => {
            res();
        });
    }
    unloadResource(): void {
        this.ownPlayer!.unloadResource();
    }

    moveOwnUp() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x,
                y: this.ownPlayer.y - 1
            })
        }
    }

    moveOwnDown() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x,
                y: this.ownPlayer.y + 1
            })
        }
    }

    moveOwnLeft() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x - 1,
                y: this.ownPlayer.y
            })
        }
    }

    moveOwnRight() {
        if (this.ownPlayer !== null) {
            this.client.send<PositionUpdate>("posupdate", {
                id: MultiplayerClient.Client.id,
                x: this.ownPlayer.x + 1,
                y: this.ownPlayer.y
            })
        }
    }
}