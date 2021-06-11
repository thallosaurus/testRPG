import { Controllers } from '../lib/Controllers.js';

export default class RequestedFile {
    get rTimestamp() {
        return Controllers.CanvasController.currentFrames;
    }
    static async load(path: string): Promise<Blob> {
        return (await fetch(path)).blob();
    }

    public parse() {
        
    }
}