import Canvas from './lib/Controllers/CanvasController';
import io from 'socket.io-client';

// let canvas;

window.onload = () => {
    (<any>window).canvas = new Canvas();
    // (<any>window).canvas.startGame();
}