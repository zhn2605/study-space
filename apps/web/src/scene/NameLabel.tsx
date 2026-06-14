import { Html } from "@react-three/drei";
import type { JSX } from "react";

type Props = { x: number, y: number, z: number, name: string };

export function NameLabel({ x, y, z, name }: Props): JSX.Element {
    return (
        <Html position={[x, y+1.8, z]} center distanceFactor={8} style={{ pointerEvents: "none"}}>
            <div 
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.55)",
                    color: "white",
                    padding: "1vh 1vh",
                    borderRadius: "1vh",
                    fontSize: "3vh",
                    fontFamily: "system-ui",
                    whiteSpace: "nowrap",
                }}>
                {name}
            </div>
        </Html>
    )
}