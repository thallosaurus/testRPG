import { Player } from "../Server/Player";

export interface LevelChangeEvent {
    level: string;
}

export interface PlayerX {
    newX: number;
}

export interface PlayerY {
    newY: number;
}

export interface PlayerJoinEvent {
    id: string;
}

export interface ClientJoinLogin extends PlayerJoinEvent {
    username: string;
    password: string;
}

export interface ClientJoinEvent extends PlayerJoinEvent {

}

export interface NewPlayerEvent extends PlayerJoinEvent{
    x: number;
    y: number;
    name: string;
}

export interface UpdateEvent {
    id: string;
    x: number;
    y: number;
}

export interface PositionUpdate {
    id: string;
    x: number;
    y: number;
}

export interface BoardUpdate {
    players: Array<UpdateEvent>;
}


export interface KillEvent {
    id: string;
}

export interface ErrorEvent {
    msg: string;
    desc: string;
}

export interface HelloEventArray {
    players: Array<HelloEvent>;
}

export interface HelloEvent {
    id: string;
    x: number;
    y: number;
    name: string;
}