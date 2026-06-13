export type Vec3 = { 
    x: number; 
    y: number; 
    z: number 
};

export type TimerView = {
    durationSec: number;
    startedAt: number;
    pausedRemainingSec: number;
};

export type PlayerView = {
    sessionId: string;
    name: string;
    position: Vec3;
    rotationY: number;
    color: string;
    countryCode: string;
    pingMs: number;
    timer: TimerView;
};

export type RoomStateView = {
    name: string;
    isPublic: boolean;
    password: string;
    players: Map<string, PlayerView>;
};