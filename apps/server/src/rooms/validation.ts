import type { ClientInput } from "@study-space/shared";

function isFiniteNumber(x: unknown): x is number {
    return typeof x === "number" && Number.isFinite(x);
}

function isVec3(input: unknown): boolean {
    if (typeof input != "object" || input === null) return false;
    const v = input as Record<string, unknown>;
    return isFiniteNumber(v.x) && isFiniteNumber(v.y) && isFiniteNumber(v.z);
}

export function validateClientInput(msg: unknown): msg is ClientInput {
    if (typeof msg !== "object" || msg === null) return false;
    const m = msg as Record<string, unknown>;
    if (m.t === "move") {
        return isVec3(m.pos) && isFiniteNumber(m.rotY);
    } else if (m.t === "timer.start" || m.t === "timer.pause" || m.t === "timer.reset") {
        return true;
    } else if (m.t === "timer.set") {
        return isFiniteNumber(m.durationSec) && m.durationSec >= 0;
    } else {
        return false;
    }
}