import { useState, type JSX } from "react";
import { useSession } from "../state/session";

function CopyButton({ text }: { text: string }): JSX.Element {
    const [copied, setCopied] = useState(false);
    async function onClick(): Promise<void> {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            /* ignore */
        }
    }
    return (
        <button onClick={onClick} style={{ marginLeft: 6, fontSize: 11 }}>
            {copied ? "copied" : "copy"}
        </button>
    );
}

export function RoomInfo(): JSX.Element | null {
    const roomId = useSession((s) => s.roomId);
    const passcode = useSession((s) => s.passcode);
    const leaveRoom = useSession((s) => s.leaveRoom);
    if (!roomId) return null;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(0,0,0,0.55)",
                padding: 12,
                borderRadius: 8,
                color: "white",
                fontFamily: "system-ui",
                fontSize: 13,
                minWidth: 220,
            }}
        >
            <div>
                Room: <code>{roomId}</code>
                <CopyButton text={roomId} />
            </div>
            {passcode && (
                <div style={{ marginTop: 4 }}>
                    Passcode: <code>{passcode}</code>
                    <CopyButton text={passcode} />
                </div>
            )}
            <button onClick={leaveRoom} style={{ marginTop: 8 }}>
                Leave
            </button>
        </div>
    );
}
