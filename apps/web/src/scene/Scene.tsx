import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PlayerView } from "@study-space/shared";
import { useEffect, useRef, useState, type JSX } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import type { ClientRoom } from "../net/colyseusClient";
import { sendMove, type LocalPose } from "../net/inputLoop";
import { CameraRig, type CameraState } from "./CameraRig";
import { CafeEnvironment } from "./Environment";
import { NameLabel } from "./NameLabel";
import { PlayerCharacter } from "./PlayerCharacter";

const SPEED = 4;
const SEND_HZ = 15;
const REMOTE_IDLE_AFTER_MS = 200;

const MOUSE_SENS = 0.01;
const PITCH_MIN = 0.05;
const PITCH_MAX = 1.35;
const FAR_DIST = Math.hypot(4, 6);
const CLOSE_DIST = 2;
const ZOOM_STEP = 0.6;
const INITIAL_PITCH = Math.atan2(4, 6);
const SMOOTH_K = 14;
const HEAD_HEIGHT = 1.4;

function SceneInner({ room, players }: { room: ClientRoom; players: Record<string, PlayerView> }): JSX.Element {
    const keys = useKeyboard();
    const pose = useRef<LocalPose>({ x: 0, y: 0, z: 0, rotY: 0 });
    const lastSend = useRef(0);
    const [, force] = useState(0);

    const moving = useRef<Map<string, boolean>>(new Map());
    const lastSeen = useRef<Map<string, { x: number; z: number; t: number }>>(new Map());

    const target = useRef({ yaw: 0, pitch: INITIAL_PITCH, dist: FAR_DIST });
    const smooth = useRef<CameraState>({
        yaw: 0,
        pitch: INITIAL_PITCH,
        dist: FAR_DIST,
        targetX: 0,
        targetY: 3,
        targetZ: 0,
    });

    const selfId = room.sessionId;
    const gl = useThree((s) => s.gl);

    useEffect(() => {
        const el = gl.domElement;

        function onClick(): void {
            if (document.pointerLockElement !== el) el.requestPointerLock();
        }
        function onMouseMove(e: MouseEvent): void {
            if (document.pointerLockElement !== el) return;
            target.current.yaw -= e.movementX * MOUSE_SENS;
            target.current.pitch += e.movementY * MOUSE_SENS;
            if (target.current.pitch < PITCH_MIN) target.current.pitch = PITCH_MIN;
            else if (target.current.pitch > PITCH_MAX) target.current.pitch = PITCH_MAX;
        }
        function onWheel(e: WheelEvent): void {
            e.preventDefault();
            const next = target.current.dist + Math.sign(e.deltaY) * ZOOM_STEP;
            if (next < CLOSE_DIST) target.current.dist = CLOSE_DIST;
            else if (next > FAR_DIST) target.current.dist = FAR_DIST;
            else target.current.dist = next;
        }

        el.addEventListener("click", onClick);
        el.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            el.removeEventListener("click", onClick);
            el.removeEventListener("wheel", onWheel);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [gl]);

    useFrame((_, dt) => {
        const a = 1 - Math.exp(-SMOOTH_K * dt);
        smooth.current.yaw += (target.current.yaw - smooth.current.yaw) * a;
        smooth.current.pitch += (target.current.pitch - smooth.current.pitch) * a;
        smooth.current.dist += (target.current.dist - smooth.current.dist) * a;

        const k = keys.current;
        const inputF = (k.has("KeyW") ? 1 : 0) - (k.has("KeyS") ? 1 : 0);
        const inputR = (k.has("KeyD") ? 1 : 0) - (k.has("KeyA") ? 1 : 0);

        const yaw = smooth.current.yaw;
        const fwdX = -Math.sin(yaw);
        const fwdZ = -Math.cos(yaw);
        const rightX = -fwdZ;
        const rightZ = fwdX;

        let dx = fwdX * inputF + rightX * inputR;
        let dz = fwdZ * inputF + rightZ * inputR;

        const localMoving = dx !== 0 || dz !== 0;
        if (localMoving) {
            const len = Math.hypot(dx, dz);
            dx /= len;
            dz /= len;
            pose.current.x += dx * SPEED * dt;
            pose.current.z += dz * SPEED * dt;
            pose.current.rotY = Math.atan2(dx, dz);
        }

        // update camera location
        smooth.current.targetX = pose.current.x;
        smooth.current.targetY = pose.current.y + HEAD_HEIGHT;
        smooth.current.targetZ = pose.current.z;

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
            <ambientLight intensity={50}  color={"#a16e38"}/>
            {/* <directionalLight position={[10, 12, 6]} intensity={0.9} castShadow /> */}
            <CafeEnvironment />
            <CameraRig state={smooth} />
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
