import { Client, type Room } from "@colyseus/sdk";
import type { RoomStateView } from "@study-space/shared";

const ENDPOINT = import.meta.env.DEV ? "ws://localhost:2567" : `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}`;

export const client = new Client(ENDPOINT);

export type ClientRoom = Room<RoomStateView>;

export async function joinRoomById(registryId: string, name: string, passcode: string | null): Promise<ClientRoom> {
    const httpBase = ENDPOINT.replace(/^ws/, "http");
    const resolveRes = await fetch(`${httpBase}/api/rooms/${registryId}/resolve`);
    if (!resolveRes.ok) throw new Error("room not found");
    const { mmId } = await resolveRes.json();
    return client.joinById<RoomStateView>(mmId, {
        name,
        passcode: passcode ?? undefined,
    });
}

export async function createRoomServer(name: string, isPublic: boolean, passcode?: string): Promise<{id: string}> {
    const httpBase = ENDPOINT.replace(/^ws/, "http");
    const res = await fetch(`${httpBase}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ name, isPublic, passcode }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function listPublicRooms(): Promise<{ id: string; name: string; playerCount: number }[]> {
    const httpBase = ENDPOINT.replace(/^ws/, "http");
    const res = await fetch(`${httpBase}/api/rooms`);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()).rooms;
}