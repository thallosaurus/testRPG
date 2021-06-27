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
/*     x: number;
    y: number; */
}

export interface NewPlayerEvent extends PlayerJoinEvent{
    x: number;
    y: number;
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