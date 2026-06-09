export type Vec3 = { 
    x: number; 
    y: number; 
    z: number 
};

export type TimerState = {
    durationSec: number;
    startedAt: number | null;
    pausedRemainingSec: number | null;
};

export type Player = {
    sessionId: string;
    name: string;
    position: Vec3;
    rotationY: number;
    countryCode: string | null;
    pingMs: number | null;
    timer: TimerState;
};

export type RoomState = {
    name: string;
    isPublic: boolean;
    password: string | null;
    players: Record<string, Player>;
};

export const DEFAULT_TIMER: TimerState = {
    durationSec: 25 * 60,
    startedAt: null,
    pausedRemainingSec: null,
};
