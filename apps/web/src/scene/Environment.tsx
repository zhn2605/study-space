import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import cafeUrl from "/assets/cafe.glb?url";

export function CafeEnvironment(): JSX.Element {
    const {scene } = useGLTF(cafeUrl);
    return (
        <group scale={1.8} rotation={[0, Math.PI/2, 0]}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload(cafeUrl);