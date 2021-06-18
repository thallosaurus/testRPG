import { BlackoutAnimation } from "./BlackoutAnimation.js";
import { ObjectRegistry } from "./ObjectRegistry.js";

const FRAMES = 60;

export class AnimationController {
    static mapMovePromise: Promise<unknown> | null = null;

    static get isMoving() {
        return this.mapMovePromise !== null;
    }

    static mapMoveUp() {
        // ObjectRegistry.world.offsetY = 1;

        if (AnimationController.mapMovePromise === null) {
            return AnimationController.mapMovePromise = new Promise<void>(async (res) => {
                let i = 0;

                while (i !== FRAMES) {
                    // ObjectRegistry.world.offsetY = (i * -1);
                    ObjectRegistry.world.setOffset(0, (i / FRAMES));
                    ObjectRegistry.player.setOffset(0, (i / FRAMES) * -1);
                    // ObjectRegistry.world.offsetX = 100 / i;
                    if (i % (FRAMES / 4) === 0) ObjectRegistry.player.progressWalking();
                    await AnimationController.wait(5);
                    i++;
                }
                // ObjectRegistry.world.offsetY = 0;
                ObjectRegistry.world.setOffset(0, 0);
                ObjectRegistry.player.setOffset(0, 0);
                ObjectRegistry.world.posY++;
                ObjectRegistry.player.y_--;
                AnimationController.mapMovePromise = null;
                res();
            });
        } else {
            return null;
        }
    }

    static mapMoveDown() {
        // ObjectRegistry.world.offsetY = 1;

        if (AnimationController.mapMovePromise === null) {
            // ObjectRegistry.player.lookTo(PlayerDirection.DOWN);
            return AnimationController.mapMovePromise = new Promise<void>(async (res, rej) => {
                let i = 0;

                while (i !== FRAMES) {
                    // ObjectRegistry.world.offsetY = (i * -1);
                    ObjectRegistry.world.setOffset(0, (i / FRAMES) * -1);
                    ObjectRegistry.player.setOffset(0, (i / FRAMES));
                    if (i % (FRAMES / 4) === 0) ObjectRegistry.player.progressWalking();
                    // if (i % 12.5 == )
                    // ObjectRegistry.world.offsetX = 100 / i;
                    await AnimationController.wait(2);
                    i++;
                }
                // ObjectRegistry.world.offsetY = 0;
                ObjectRegistry.world.setOffset(0, 0);
                ObjectRegistry.player.setOffset(0, 0);
                ObjectRegistry.world.posY--;
                ObjectRegistry.player.y_++;
                AnimationController.mapMovePromise = null;
                res();
            });
        } else {
            return null;
        }
    }

    static mapMoveLeft() {
        // ObjectRegistry.world.offsetY = 1;

        if (AnimationController.mapMovePromise === null) {
            // ObjectRegistry.player.lookTo(PlayerDirection.LEFT);
            return AnimationController.mapMovePromise = new Promise<void>(async (res, rej) => {
                let i = 0;

                while (i !== FRAMES) {
                    // ObjectRegistry.world.offsetY = (i * -1);
                    ObjectRegistry.world.setOffset((i / FRAMES), 0);
                    ObjectRegistry.player.setOffset((i / FRAMES) * -1, 0);
                    if (i % (FRAMES / 4) === 0) ObjectRegistry.player.progressWalking();
                    // ObjectRegistry.world.offsetX = 100 / i;
                    await AnimationController.wait(2);
                    i++;
                }
                // ObjectRegistry.world.offsetY = 0;
                ObjectRegistry.world.setOffset(0, 0);
                ObjectRegistry.player.setOffset(0, 0);
                ObjectRegistry.world.posX++;
                ObjectRegistry.player.x_--;
                AnimationController.mapMovePromise = null;
                res();
            });
        }
    }

    static mapMoveRight() {
        // ObjectRegistry.world.offsetY = 1;

        if (AnimationController.mapMovePromise === null) {
            // ObjectRegistry.player.lookTo(PlayerDirection.RIGHT);
            return AnimationController.mapMovePromise = new Promise<void>(async (res, rej) => {
                let i = 0;

                while (i !== FRAMES) {
                    // ObjectRegistry.world.offsetY = (i * -1);
                    ObjectRegistry.world.setOffset((i / FRAMES) * -1, 0);
                    ObjectRegistry.player.setOffset((i / FRAMES), 0);
                    if (i % (FRAMES / 4) === 0) ObjectRegistry.player.progressWalking();
                    // ObjectRegistry.world.offsetX = 100 / i;
                    await AnimationController.wait(2);
                    i++;
                }
                // ObjectRegistry.world.offsetY = 0;
                ObjectRegistry.world.setOffset(0, 0);
                ObjectRegistry.player.setOffset(0, 0);
                ObjectRegistry.world.posX--;
                ObjectRegistry.player.x_++;
                AnimationController.mapMovePromise = null;
                res();
            });
        }
    }



    static async wait(duration: number) {
        return new Promise((res, rej) => {
            setTimeout(res, duration / 2);
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