import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import cafeUrl from "/assets/cafe.glb?url";

export function CafeEnvironment(): JSX.Element {
    const {scene } = useGLTF(cafeUrl);
    return <primitive object={scene} />
}

useGLTF.preload(cafeUrl);