import type { PlayerView } from "@study-space/shared";
import type { JSX } from "react";

type Props = { players: Record<string, PlayerView>; selfId: string };

export function PlayerList({ players, selfId }: Props): JSX.Element {
    const list = Object.values(players);
    return (
        <div
            style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.45)",
                padding: 12,
                borderRadius: 8,
                color: "white",
                minWidth: 160,
                fontFamily: "system-ui",
                fontSize: 13,
            }}
        >
            <div style={{ opacity: 0.7, marginBottom: 6 }}>In this cafe ({list.length})</div>
            {list.map((p) => (
                <div key={p.sessionId} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{p.name}{p.sessionId === selfId ? " (you)" : ""}</span>
                {/* country flag + ping */}
            </div>
        ))}
        </div>
    );
}