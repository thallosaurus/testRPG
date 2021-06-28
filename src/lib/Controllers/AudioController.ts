import { isContext } from "vm";
import { ResourceLoader } from "../Interfaces/ResourceLoader";

export class AudioController {
    static audioCtx?: AudioContext;
    constructor() {

    }

    static activateAudioContext() {
        try {
            if((window as any).webkitAudioContext) {
                this.audioCtx = new (window as any).webkitAudioContext();
              } else {
                this.audioCtx = new window.AudioContext();
              }
            
            this.audioCtx = new AudioContext();
        } catch (e) {
            alert("Audio is not supported on this browser :(");
        }
    }

    static async playSound(sound: ArrayBuffer) {
        //this.audioCtx?.decodeAudioData()
        if (!this.audioCtx) {
            return;
        }

        let s = await this.decodeSound(sound);
        console.log(s);
        let buffersource = this.audioCtx.createBufferSource();
        buffersource.buffer = s;
        //console.log(s);
        buffersource.start(this.audioCtx.currentTime);
        buffersource.connect(this.audioCtx.destination);
    }
    
    static decodeSound(sound: ArrayBuffer): Promise<AudioBuffer> {
        return this.audioCtx!.decodeAudioData(sound);
    }
}