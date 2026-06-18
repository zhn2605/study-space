import type { PlayerView } from "@study-space/shared";
import { useEffect, useState, type JSX } from "react";
import type { ClientRoom } from "../net/colyseusClient";

function remainingSec(p: PlayerView, nowMs: number): number {
    const t = p.timer;
    if (t.startedAt !== 0) {
        const elapsed = (nowMs - t.startedAt) / 1000;
        return Math.max(0, t.durationSec - elapsed);
    }
    if (t.pausedRemainingSec !== -1) return t.pausedRemainingSec;
    return t.durationSec;
}

function fmt(sec: number): string {
    const s = Math.ceil(sec);
    const m =Math.floor(s/60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
}

export function TimerWidget({ room, self}: { room: ClientRoom; self: PlayerView }): JSX.Element {
    const [now, setNow] = useState(Date.now());
    const [draft, setDraft] = useState(25);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(id);
    }, []);

    const remaining = remainingSec(self, now);
    const running = self.timer.startedAt !== 0;

    return (
    <div
        style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.55)",
            padding: 12,
            borderRadius: 8,
            color: "white",
            fontFamily: "system-ui",
            minWidth: 180,
        }}
        >
        <div style={{ fontSize: 36, fontVariantNumeric: "tabular-nums" }}>{fmt(remaining)}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {!running ? (
            <button onClick={() => room.send("timer.start", {})}>Start</button>
            ) : (
            <button onClick={() => room.send("timer.pause", {})}>Pause</button>
            )}
            <button onClick={() => room.send("timer.reset", {})}>Reset</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12 }}>
            Set:&nbsp;
            <input
            type="number"
            min={1}
            max={120}
            value={draft}
            onChange={(e) => setDraft(Number(e.target.value))}
            style={{ width: 50 }}
            />
            &nbsp;min&nbsp;
            <button
            onClick={() => room.send("timer.set", { durationSec: Math.max(60, draft * 60) })}
            >
            Apply
            </button>
        </div>
    </div>
  );

}