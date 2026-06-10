import { Client, type Room } from "@colyseus/sdk";
import type { RoomState } from "@study-space/shared";

const ENDPOINT = import.meta.env.DEV ? "ws://localhost:2567" : `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}`;

export const client = new Client(ENDPOINT);

export type ClientRoom = Room<RoomState>;

export async function joinStudyRoom(name: string): Promise<ClientRoom> {
    return client.joinOrCreate("study_room", { name });
}