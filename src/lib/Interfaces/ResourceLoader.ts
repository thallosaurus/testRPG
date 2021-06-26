import { TiledJSONMap } from "../Map/TiledJSONMap";

export interface ResourceLoader {
    resolveResource(): Promise<void>;
    unloadResource(): void;
    getResource?(): any;
}

export interface ImageLoader extends ResourceLoader {
    // getResource(): HTMLImageElement | null;
}

export interface LevelLoader extends ResourceLoader {
    // getResource(): TiledJSONMap | null;
}

export interface AudioLoader extends ResourceLoader {
    
}