import type { RoomSummary } from "@study-space/shared";
import { randomUUID } from "crypto";

type Entry = {
    id: string;
    name: string;
    isPublic: boolean;
    passcode: string | null;
    playerCount: number;
};

export type CreateInput = {
    name: string;
    isPublic: boolean;
    passcode?: string;
};

export class RoomRegistry{
    private rooms = new Map<string, Entry>();
    private mmIdByRegistryId = new Map<string, string>();

    create(input: CreateInput): { id: string } {
        const trimmed = input.name.trim();
        if (trimmed.length === 0) throw new Error("room name required");
        if (!input.isPublic && (!input.passcode || input.passcode.length === 0)) {
            throw new Error("passcode required for private rooms");
        }
        const id = randomUUID();
        this.rooms.set(id, {
            id,
            name: trimmed.slice(0, 64),
            isPublic: input.isPublic,
            passcode: input.isPublic ? null : input.passcode!,
            playerCount: 0,
        });
        return { id };
    }

    bindMatchMakerId(registryId: string, mmId: string): void {
        this.mmIdByRegistryId.set(registryId, mmId);
    }

    getMatchMakerId(registryId: string): string | undefined {
        return this.mmIdByRegistryId.get(registryId);
    }

    listPublic(): RoomSummary[] {
        const out: RoomSummary[] = [];
        for (const r of this.rooms.values()) {
            if (r.isPublic) out.push({ id: r.id, name: r.name, playerCount: r.playerCount });
        }
        return out;
    }

    validatePasscode(id: string, passcode: string | undefined): boolean {
        const r = this.rooms.get(id);
        if (!r) return false;
        if (r.isPublic) return true;
        return passcode === r.passcode;
    }

    setPlayerCount(id: string, count: number): void {
        const r = this.rooms.get(id);
        if (r) r.playerCount = count;
    }

    remove(id: string): void {
        this.rooms.delete(id);
    }

    get(id: string): Entry | undefined {
        return this.rooms.get(id);
    }
}