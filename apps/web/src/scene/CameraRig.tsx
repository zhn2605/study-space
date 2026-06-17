import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const offset = new Vector3(0, 4, 6);
const target = new Vector3();
const desired = new Vector3();

export function CameraRig({ x, y, z}: {x:number, y: number, z: number}): null {
    const camera = useThree((s) => s.camera);

    useFrame((_, dt) => {
        target.set(x, y, z);
        desired.copy(target).add(offset);
        camera.position.lerp(desired, Math.min(1, dt * 4));
        camera.lookAt(target);
    });

    return null;
}