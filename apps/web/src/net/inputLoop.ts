import type { ClientRoom } from "./colyseusClient";

export type LocalPose = {
    x: number;
    y: number;
    z: number;
    rotY: number;
}

export function sendMove(room: ClientRoom, pose: LocalPose): void {
    room.send("move", {
        position: { x: pose.x, y: pose.y, z: pose.z },
        rotationY: pose.rotY,
    });
}