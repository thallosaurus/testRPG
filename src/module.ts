import Canvas from './lib/CanvasController.js';

// let canvas;

window.onload = () => {
    (<any>window).canvas = new Canvas();
    // (<any>window).canvas.startGame();
}