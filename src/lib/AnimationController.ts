import { BlackoutAnimation } from "./BlackoutAnimation.js";
import Canvas from "./CanvasController.js";
import { ObjectRegistry } from "./ObjectRegistry.js";
import { PlayerDirection } from "./Sprite.js";

const FRAMES = 60;

export class AnimationController {
    static mapMovePromise: Promise<void> | null = null;

    static get isMoving() {
        return this.mapMovePromise !== null;
    }

    static walkingDirAlternate = false;

    static dir: PlayerDirection | null = null;

    /**
     * 
     * @returns 
     */
    static mapMoveUp() {
        this.dir = PlayerDirection.UP;
        return this.move();
    }

    /**
     * 
     * @returns 
     */
    static mapMoveDown() {
        // ObjectRegistry.world.offsetY = 1;
        this.dir = PlayerDirection.DOWN;
        return this.move();
    }

    /**
     * 
     * @returns 
     */
    static mapMoveLeft() {
        // ObjectRegistry.world.offsetY = 1;

        this.dir = PlayerDirection.LEFT;
        return this.move();
    }

    static mapMoveRight() {
        // ObjectRegistry.world.offsetY = 1;
        this.dir = PlayerDirection.RIGHT;
        return this.move();
    }

    static move() {
            if (!this.isMoving) {
                this.mapMovePromise = new Promise<void>(async (res, rej) => {
                    let i = 0;

                    while (i !== FRAMES) {
                        switch (this.dir) {
                            case PlayerDirection.UP:
                                ObjectRegistry.world.setOffset(0, (i / FRAMES));
                                ObjectRegistry.player.setOffset(0, (i / FRAMES) * -1);
                                break;

                            case PlayerDirection.DOWN:
                                ObjectRegistry.world.setOffset(0, (i / FRAMES) * -1);
                                ObjectRegistry.player.setOffset(0, (i / FRAMES));
                                break;

                            case PlayerDirection.LEFT:
                                ObjectRegistry.world.setOffset((i / FRAMES), 0);
                                ObjectRegistry.player.setOffset((i / FRAMES) * -1, 0);
                                break;

                            case PlayerDirection.RIGHT:
                                ObjectRegistry.world.setOffset((i / FRAMES) * -1, 0);
                                ObjectRegistry.player.setOffset((i / FRAMES), 0);
                                break;
                        }

                        if (i % (FRAMES / 4) === 0) ObjectRegistry.player.progressWalking();

                        await AnimationController.wait(2);
                        i++;
                    }

                    this.resetOffsets();

                    switch (this.dir) {
                        case PlayerDirection.UP:
                            this.finalizeMoveUp();
                            break;

                        case PlayerDirection.DOWN:
                            this.finalizeMoveDown();
                            break;

                        case PlayerDirection.LEFT:
                            this.finalizeMoveLeft();
                            break;

                        case PlayerDirection.RIGHT:
                            this.finalizeMoveRight();
                            break;
                    }

                    this.mapMovePromise = null;
                    res();
                });

                console.log(this.mapMovePromise);
                return this.mapMovePromise;
            } else {
                return null;
            }
    }

    static resetOffsets() {
        ObjectRegistry.world.setOffset(0, 0);
        ObjectRegistry.player.setOffset(0, 0);
    }

    static finalizeMoveRight() {
        ObjectRegistry.world.posX--;
        ObjectRegistry.player.x_++;
    }

    static finalizeMoveLeft() {
        ObjectRegistry.world.posX++;
        ObjectRegistry.player.x_--;
    }

    static finalizeMoveDown() {
        ObjectRegistry.world.posY--;
        ObjectRegistry.player.y_++;
    }

    static finalizeMoveUp() {
        ObjectRegistry.world.posY++;
        ObjectRegistry.player.y_--;
    }

    static async wait(duration: number) {
        console.log(duration, duration/2);
        return new Promise((res, rej) => {
            setTimeout(res, duration / Canvas.deltaTime);
        });
    }

    static showBlackoutAnimation(): Promise<void> {
        return new Promise(async (res, rej) => {
            ObjectRegistry.player.movementBlocked = true;
            let i = 0;
            while (i < 100) {
                BlackoutAnimation.alpha = i;
                await AnimationController.wait(1);
                i++;
            }
            res();
        });
    }

    static hideBlackoutAnimation(): Promise<void> {
        return new Promise(async (res, rej) => {
            let i = 100;
            while (i !== 0) {
                BlackoutAnimation.alpha = i;
                await AnimationController.wait(1);
                i--;
            }
            ObjectRegistry.player.movementBlocked = false;
            res();
        });
    }
}