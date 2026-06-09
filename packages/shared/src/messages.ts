import type { Vec3 } from "./room.js";

export type ClientInput =
    | { type: "move"; position: Vec3; rotationY: number }
    | { type: "timer.set"; durationSec: number }
    | { type: "timer.start" }
    | { type: "timer.pause" }
    | { type: "timer.reset" };
    // add more message types as needed, e.g., chat messages, interactions, etc.