import { useEffect, useState, type JSX } from "react";
import { createRoomServer } from "../net/colyseusClient.js";
import { useLobby } from "../state/lobby.js";
import { useSession } from "../state/session.js";

export function Lobby(): JSX.Element {
    const { rooms, loading, refresh } = useLobby();
    const setRoom = useSession((s) => s.setRoom);
    const [createName, setCreateName] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [createPasscode, setCreatePasscode] = useState("");
    const [joinId, setJoinId] = useState("");
    const [joinPasscode, setJoinPasscode] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        refresh();
        const t = setInterval(refresh, 5000);
        return () => clearInterval(t);
    }, [refresh]);

    async function handleCreate(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        setError(null);
        try {
        const { id } = await createRoomServer(
            createName.trim(),
            isPublic,
            isPublic ? undefined : createPasscode,
        );
        setRoom(id, isPublic ? undefined : createPasscode);
        } catch (err) {
        setError((err as Error).message);
        }
    }

    function handleJoinPublic(id: string): void {
        setRoom(id);
    }

    function handleJoinPrivate(e: React.FormEvent): void {
        e.preventDefault();
        setRoom(joinId.trim(), joinPasscode);
    }

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
        <h1>Pick a cafe</h1>

        <section style={{ marginBottom: 24 }}>
            <h2>Public</h2>
            {loading && rooms.length === 0 && <div>Loading…</div>}
            {!loading && rooms.length === 0 && <div>No public rooms yet.</div>}
            <ul style={{ listStyle: "none", padding: 0 }}>
            {rooms.map((r) => (
                <li key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>{r.name} <em>({r.playerCount})</em></span>
                <button onClick={() => handleJoinPublic(r.id)}>Join</button>
                </li>
            ))}
            </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
            <h2>Create</h2>
            <form onSubmit={handleCreate}>
            <input
                placeholder="Cafe name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                maxLength={64}
            />
            <label style={{ marginLeft: 8 }}>
                <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                />{" "}
                Public
            </label>
            {!isPublic && (
                <input
                style={{ marginLeft: 8 }}
                placeholder="Passcode"
                value={createPasscode}
                onChange={(e) => setCreatePasscode(e.target.value)}
                />
            )}
            <button type="submit" style={{ marginLeft: 8 }} disabled={createName.trim().length === 0}>
                Create
            </button>
            </form>
        </section>

        <section>
            <h2>Join by passcode</h2>
            <form onSubmit={handleJoinPrivate}>
            <input placeholder="Room id" value={joinId} onChange={(e) => setJoinId(e.target.value)} />
            <input
                style={{ marginLeft: 8 }}
                placeholder="Passcode"
                value={joinPasscode}
                onChange={(e) => setJoinPasscode(e.target.value)}
            />
            <button type="submit" style={{ marginLeft: 8 }} disabled={joinId.trim().length === 0}>
                Join
            </button>
            </form>
        </section>

        {error && <div style={{ color: "tomato", marginTop: 12 }}>Error: {error}</div>}
        </div>
    );
}
