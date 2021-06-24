export interface TiledJSONMap {
    compressionlevel: number;
    height: number;
    width: number;
    infinite: boolean;
    layers: Array<TiledJSONLevelLayer | TiledJSONObjectLayer>;
    // nextlayerid: number;
    // nextobjectid: number;
    // orientation: string;
    // renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    // tilesets: number;
    type: string;
    version: string;
}

export interface TiledJSONLevelLayer {
    data: Array<number>;
    height: number;
    width: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
    properties: Array<TiledJSONLevelLayerProperties>;
}

export interface TiledJSONObjectLayer {
    draworder: string;
    id: number;
    name: string;
    objects: Array<TiledJSONObject>;
    opacity: number;
    type: string;
    visible: boolean;
    x: number;
    y: number;
}

export interface TiledJSONObject {
    height: number;
    id: number;
    name: string;
    properties: Array<TiledJSONLevelLayerProperties>;
    rotation: number;
    type: string;
    visible: true;
    width: number;
    x: number;
    y: number;
}

export interface TiledJSONLevelLayerProperties {
    name: string;
    value: any;
}