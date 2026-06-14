import { Canvas, useFrame } from "@react-three/fiber";
import type { PlayerView } from "@study-space/shared";
import { useRef, type JSX } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import type { ClientRoom } from "../net/colyseusClient";
import { sendMove, type LocalPose } from "../net/inputLoop";
import { Ground } from "./Ground";
import { NameLabel } from "./NameLabel";
import { PlayerCube } from "./PlayerCube";

const SPEED = 5; // units /sec
const SEND_HZ = 60;

function SceneInner({ room, players }: { room: ClientRoom; players: Record<string, PlayerView> }): JSX.Element {
    const keys = useKeyboard();
    const pose = useRef<LocalPose>({ x: 0, y: 0.5, z: 0, rotY: 0 });
    const lastSend = useRef(0);

    useFrame((_, dt) => {
        const k = keys.current;
        let dx = 0;
        let dz = 0;
        if (k.has("KeyW")) dz -= 1;
        if (k.has("KeyS")) dz += 1;
        if (k.has("KeyA")) dx -= 1;
        if (k.has("KeyD")) dx += 1;

        if (dx !== 0 || dz !== 0) {
            const len = Math.sqrt(dx * dx + dz * dz);
            pose.current.x += (dx / len) * SPEED * dt;
            pose.current.z += (dz / len) * SPEED * dt;
            pose.current.rotY = Math.atan2(dx, -dz);
        }

        lastSend.current += dt;
        if (lastSend.current >= 1 / SEND_HZ) {
            lastSend.current = 0;
            sendMove(room, pose.current);
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
            <Ground />
            {Object.values(players).map((p) => (
                <group key={p.sessionId}>
                    <PlayerCube
                        x={p.position.x}
                        y={p.position.y}
                        z={p.position.z}
                        rotY={p.rotationY}
                        color={p.color}
                    />
                    <NameLabel
                        x={p.position.x}
                        y={p.position.y}
                        z={p.position.z}
                        name={p.name}
                    />
                </group>
            ))}
        </>
    );
}

export function Scene({ room, players }: { room: ClientRoom, players: Record<string, PlayerView> }): JSX.Element {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 8, 10], fov: 60 }}
            style={{ position: "absolute", inset: 0}}
        >
            <SceneInner room={room} players={players} />
        </Canvas>
    )
}