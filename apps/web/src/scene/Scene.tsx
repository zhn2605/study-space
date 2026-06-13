import { Canvas, useFrame } from "@react-three/fiber";
import type { Vec3 } from "@study-space/shared";
import { Fragment, useEffect, useRef, useState, type JSX } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import type { ClientRoom } from "../net/colyseusClient";
import { sendMove, type LocalPose } from "../net/inputLoop";
import { Ground } from "./Ground";
import { PlayerCube } from "./PlayerCube";
import { NameLabel } from "./NameLabel";

type RemotePlayer = {
    sessionId: string;
    name: string;
    position: Vec3;
    rotationY: number;
    color: string;
    countryCode: string | null;
    pingMs: number | null;
    timer: {
        durationSec: number;
        startedAt: number | null;
        pausedRemainingSec: number | null;
    };
};

const SPEED = 4; // units /sec
const SEND_HZ = 15;

function colorForId(id: string): string {
    // deterministci hue for sessionId
    let h = 0;
    for (let i = 0; i < id.length; i++) {
        h = (h*31 + id.charCodeAt(i)) >>> 0;
    }
    return `hsl(${h % 360}, 65%, 55%)`;
}

function SceneInner({ room } : { room: ClientRoom }): JSX.Element {
    const keys = useKeyboard();
    const pose = useRef<LocalPose>({ x: 0, y: 0.5, z: 0, rotY: 0 });
    const lastSend = useRef(0);
    const [remote, setRemote] = useState<Record<string, RemotePlayer>>({});

    // subscribe to room state changes and update remote players
    useEffect(() => {
        function snapshot(): void {
            const out: Record<string, RemotePlayer> = {};
            room.state.players.forEach((p, id) => {
                out[id] = {
                    sessionId: id,
                    name: p.name,
                    position: { x: p.position.x, y: p.position.y, z: p.position.z },
                    rotationY: p.rotationY,
                    color: colorForId(id),
                    countryCode: p.countryCode === "" ? null : p.countryCode,
                    pingMs: p.pingMs === -1 ? null : p.pingMs,
                    timer: {
                        durationSec: p.timer.durationSec,
                        startedAt: p.timer.startedAt === 0 ? null : p.timer.startedAt,
                        pausedRemainingSec: p.timer.pausedRemainingSec === -1 ? null : p.timer.pausedRemainingSec,
                    },
                };
            });
            setRemote(out);
        }
        room.onStateChange(snapshot);
        snapshot();
    }, [room]);

    useFrame((_, dt) => {
        const k = keys.current;
        let dx = 0;
        let dz = 0;
        if (k.has("KeyW")) { dz -= 1 };
        if (k.has("KeyS")) { dz += 1 };
        if (k.has("KeyA")) { dx -= 1 }
        if (k.has("KeyD")) { dx += 1 };

        if (dx !== 0 || dz !== 0) {
            const len = Math.sqrt(dx*dx + dz*dz);
            dx /= len;
            dz /= len;
            pose.current.x += dx * SPEED * dt;
            pose.current.z += dz * SPEED * dt;
            pose.current.rotY = Math.atan2(dx, dz);
        }

        lastSend.current += dt;
        if (lastSend.current > 1 / SEND_HZ) {
            lastSend.current = 0;
            sendMove(room, pose.current);
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
            <Ground />
            {Object.values(remote).map((p) => (
                <Fragment key={p.sessionId}>
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
                </Fragment>
             ))}
        </>
    );
}

export function Scene({ room }: { room: ClientRoom }): JSX.Element {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 8, 10], fov: 50 }}
            style={{ position: "absolute", inset: 0}}
        >
            <SceneInner room={room} />
        </Canvas>
    )
}