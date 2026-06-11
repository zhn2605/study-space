import { useEffect, useState } from "react";
import { joinStudyRoom, type ClientRoom } from "./colyseusClient";

export function useRoom(name: string | null): ClientRoom | null {
    const [room, setRoom] = useState<ClientRoom | null>(null);

    useEffect(() => {
        if (!name) return;
        let cancelled = false;
        let joined: ClientRoom | null = null;

        joinStudyRoom(name)
            .then((room) => {
                if (cancelled) {
                    room.leave();
                    return;
                }
                joined = room;
                setRoom(room);
            })
            .catch((err) => console.error("[room] join failed:", err));

        return () => {
            cancelled = true;
            joined?.leave();
            setRoom(null);
        };
    }, [name]);
    return room;
}