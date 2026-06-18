import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { Vector3 } from "three";

export type CameraState = {
    yaw: number;
    pitch: number;
    dist: number;
    targetX: number;
    targetY: number;
    targetZ: number;
};

const target = new Vector3();
const desired = new Vector3();

export function CameraRig({ state }: { state: RefObject<CameraState> }): null {
    const camera = useThree((s) => s.camera);

    useFrame(() => {
        const s = state.current;
        const cp = Math.cos(s.pitch);
        const sp = Math.sin(s.pitch);
        const sy = Math.sin(s.yaw);
        const cy = Math.cos(s.yaw);
        target.set(s.targetX, s.targetY, s.targetZ);
        desired.set(target.x + sy * cp * s.dist, target.y + sp * s.dist, target.z + cy * cp * s.dist);
        camera.position.copy(desired);
        camera.lookAt(target);
    });

    return null;
}
