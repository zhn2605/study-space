export type ServerTimer = {
    durationSec: number;
    startedAt: number | null;
    pausedRemainingSec: number | null;
};

type TimerMsg = 
    | { type: "timer.set"; durationSec: number }
    | { type: "timer.start" }
    | { type: "timer.pause" }
    | { type: "timer.reset" };

export function timerRemainingSec(t: ServerTimer, nowMs: number): number {
    if (t.startedAt !== null) {
        const elapsedSec = (nowMs - t.startedAt) / 1000;
        return Math.max(0, t.durationSec - elapsedSec);
    }
    if (t.pausedRemainingSec !== null) return t.pausedRemainingSec;
    return t.durationSec;
}

export function applyTimer(t: ServerTimer, msg: TimerMsg, nowMs: number): ServerTimer {
    switch (msg.type) {
        case "timer.set":
            return { durationSec: msg.durationSec, startedAt: null, pausedRemainingSec: null };
        case "timer.start": {
            const remaining = t.pausedRemainingSec ?? t.durationSec;
            const elapsedSec = t.durationSec - remaining;
            return {
                durationSec: t.durationSec,
                startedAt: nowMs - elapsedSec * 1000,
                pausedRemainingSec: null,
            };
        }
        case "timer.pause": {
            if (t.startedAt === null) return t;
            const remaining = timerRemainingSec(t, nowMs);
            return {
                durationSec: t.durationSec,
                startedAt: null,
                pausedRemainingSec: remaining,
            };
        }
        case "timer.reset":
            return { durationSec: t.durationSec, startedAt: null, pausedRemainingSec: null};
    }
}
