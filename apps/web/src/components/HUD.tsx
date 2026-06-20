import type { PlayerView } from "@study-space/shared";
import type { JSX } from "react";
import type { ClientRoom } from "../net/colyseusClient";
import { PlayerList } from "./PlayerList";
import { RoomInfo } from "./RoomInfo";
import { TimerWidget } from "./TimerWidget";

type Props = {
    room: ClientRoom,
    players: Record<string, PlayerView>;
};

export function HUD({ room, players }: Props): JSX.Element | null {
    const self = players[room.sessionId];
    if (!self) return null;
    return (
        <>
            <TimerWidget room={room} self={self} />
            <PlayerList players={players} selfId={room.sessionId} />
            <RoomInfo />
        </>
    )
}