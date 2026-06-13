import { type JSX } from "react";

type Props = {
    x: number;
    y: number;
    z: number;
    rotY: number;
    color: string;
};

export function PlayerCube({ x, y, z, rotY, color }: Props): JSX.Element {
    return (
        <mesh position={[x, y, z]} rotation={[0, rotY, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
        </mesh>
    );
}