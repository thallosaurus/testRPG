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
    x: number;
    y: number;
}