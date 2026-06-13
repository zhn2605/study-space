import { type JSX } from "react";

export function Ground(): JSX.Element {
    return (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#777" />
        </mesh>
    );
}