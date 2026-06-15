import type { PlayerView } from "@study-space/shared";
import { useEffect, useState } from "react";
import { joinRoomById, type ClientRoom } from "./colyseusClient";

export type RoomBundle = {
    room: ClientRoom;
    players: Record<string, PlayerView>;
};

export function useRoom(name: string | null, roomId: string | null, passcode: string | null): RoomBundle | null {
    const [bundle, setBundle] = useState<RoomBundle | null>(null);

    useEffect(() => {
        if (!name || !roomId) return;
        let cancelled = false;
        let joined: ClientRoom | null = null;

        joinRoomById(roomId, name, passcode)
            .then((room) => {
                if (cancelled) {
                    room.leave();
                    return;
                }
                joined = room;
                const snapshot = (): void => {
                    const out: Record<string, PlayerView> = {};
                    room.state.players.forEach((p, id) => {
                        out[id] = {
                            sessionId: id,
                            name: p.name,
                            position: { x: p.position.x, y: p.position.y, z: p.position.z },
                            rotationY: p.rotationY,
                            color: p.color,
                            countryCode: p.countryCode,
                            ping: p.ping,
                            timer: {
                                durationSec: p.timer.durationSec,
                                startedAt: p.timer.startedAt,
                                pausedRemainingSec: p.timer.pausedRemainingSec,
                            },
                        };
                    });
                    setBundle({ room, players: out });
                };
                room.onStateChange(snapshot);
            })
            .catch((err) => console.error("[room] join failed", err));

        return () => {
            cancelled = true;
            joined?.leave();
            setBundle(null);
        };
    }, [name, roomId, passcode]);

    return bundle;
}
