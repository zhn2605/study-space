import { Canvas, useFrame } from "@react-three/fiber";
import type { PlayerView } from "@study-space/shared";
import { useRef, useState, type JSX } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import type { ClientRoom } from "../net/colyseusClient";
import { sendMove, type LocalPose } from "../net/inputLoop";
import { CameraRig } from "./CameraRig";
import { CafeEnvironment } from "./Environment";
import { NameLabel } from "./NameLabel";
import { PlayerCharacter } from "./PlayerCharacter";

const SPEED = 4;
const SEND_HZ = 15;
const REMOTE_IDLE_AFTER_MS = 200;

function SceneInner({ room, players }: { room: ClientRoom; players: Record<string, PlayerView> }): JSX.Element {
    const keys = useKeyboard();
    const pose = useRef<LocalPose>({ x: 0, y: 0, z: 0, rotY: 0 });
    const lastSend = useRef(0);
    const [, force] = useState(0);

    const moving = useRef<Map<string, boolean>>(new Map());
    const lastSeen = useRef<Map<string, { x: number; z: number; t: number }>>(new Map());

    const selfId = room.sessionId;

    useFrame((_, dt) => {
        const k = keys.current;
        let dx = 0;
        let dz = 0;
        if (k.has("KeyW")) dz -= 1;
        if (k.has("KeyS")) dz += 1;
        if (k.has("KeyA")) dx -= 1;
        if (k.has("KeyD")) dx += 1;

        const localMoving = dx !== 0 || dz !== 0;
        if (localMoving) {
            const len = Math.hypot(dx, dz);
            pose.current.x += (dx / len) * SPEED * dt;
            pose.current.z += (dz / len) * SPEED * dt;
            pose.current.rotY = Math.atan2(dx, dz);
        }

        lastSend.current += dt;
        if (lastSend.current >= 1 / SEND_HZ) {
            lastSend.current = 0;
            sendMove(room, pose.current);
        }

        const now = performance.now();
        let anyTransition = moving.current.get(selfId) !== localMoving;
        moving.current.set(selfId, localMoving);

        for (const p of Object.values(players)) {
            if (p.sessionId === selfId) continue;
            const prev = lastSeen.current.get(p.sessionId);
            if (!prev || prev.x !== p.position.x || prev.z !== p.position.z) {
                lastSeen.current.set(p.sessionId, { x: p.position.x, z: p.position.z, t: now });
            }
            const seen = lastSeen.current.get(p.sessionId)!;
            const remoteMoving = now - seen.t < REMOTE_IDLE_AFTER_MS;
            if (moving.current.get(p.sessionId) !== remoteMoving) anyTransition = true;
            moving.current.set(p.sessionId, remoteMoving);
        }

        if (localMoving || anyTransition) force((n) => n + 1);
    });

    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 12, 6]} intensity={0.9} castShadow />
            {/* <Ground /> */}
            <CafeEnvironment />
            <CameraRig x={pose.current.x} y={pose.current.y} z={pose.current.z} />
            {Object.values(players).map((p) => {
                const isSelf = p.sessionId === selfId;
                const px = isSelf ? pose.current.x : p.position.x;
                const py = isSelf ? pose.current.y : p.position.y;
                const pz = isSelf ? pose.current.z : p.position.z;
                const prot = isSelf ? pose.current.rotY : p.rotationY;
                const isIdle = !(moving.current.get(p.sessionId) ?? false);
                return (
                    <group key={p.sessionId}>
                        <PlayerCharacter x={px} y={py} z={pz} rotY={prot} isIdle={isIdle} scale={0.006} />
                        <NameLabel x={px} y={py} z={pz} name={p.name} />
                    </group>
                );
            })}
        </>
    );
}

export function Scene({ room, players }: { room: ClientRoom; players: Record<string, PlayerView> }): JSX.Element {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 4, 6], fov: 60 }}
            style={{ position: "absolute", inset: 0 }}
        >
            <SceneInner room={room} players={players} />
        </Canvas>
    );
}
