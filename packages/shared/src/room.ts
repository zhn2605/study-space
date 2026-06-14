export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export type TimerView = {
    durationSec: number;
    startedAt: number;          // 0 = not started
    pausedRemainingSec: number; // -1 = not paused
};

export type PlayerView = {
    sessionId: string;
    name: string;
    position: Vec3;
    rotationY: number;
    color: string;       // server-assigned, stable across clients
    countryCode: string; // "" = unknown
    ping: number;        // -1 = not measured
    timer: TimerView;
};

export type RoomStateView = {
    name: string;
    isPublic: boolean;
    password: string;
    players: Map<string, PlayerView>;
};
