import Canvas from './lib/Controllers/CanvasController.js';

// let canvas;

window.onload = () => {
    (<any>window).canvas = new Canvas();
    // (<any>window).canvas.startGame();
}