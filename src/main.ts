import { Controllers } from './lib/Controllers.js';

// let canvas;

window.onload = () => {
    (<any>window).canvas = new Controllers.CanvasController();
}