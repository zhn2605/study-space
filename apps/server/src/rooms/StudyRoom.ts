import { Room, type Client } from "colyseus";
import { registry } from "./registryInstance";
import { PlayerSchema, RoomStateSchema } from "./schema.js";
import { validateClientInput } from "./validation";

function colorForId(id: string): string {
    let h = 0;
    for (let i = 0; i < id.length; i++) {
        h = (h * 31 + id.charCodeAt(i)) >>> 0;
    }
    return `hsl(${h % 360}, 65%, 55%)`;
}

type JoinOptions = { name?: string; passcode?: string };
type CreateOptions = { roomId?: string };

export class StudyRoom extends Room {
    maxClients: number = 15;
    state = new RoomStateSchema();
    private registryId: string | null = null;

    onCreate(options: CreateOptions): void {
        const id = options.roomId;
        const meta = id ? registry.get(id) : undefined;
        if (!meta) {
            throw new Error("room not found in regitsry");
        }
        this.registryId = id!;

        this.state.name = meta.name;
        this.state.isPublic = meta.isPublic;
        this.roomId = id!;

        this.onMessage("*", (client, type, payload) => {
            const msg = { type, ...(typeof payload === "object" && payload !== null ? payload : {}) };
            if (!validateClientInput(msg)) return;

            const player = this.state.players.get(client.sessionId);
            if (!player) return;

            switch (msg.type) {
                case "move": {
                    player.position.x = msg.position.x;
                    player.position.y = msg.position.y;
                    player.position.z = msg.position.z;
                    player.rotationY = msg.rotationY;
                    break;
                    // update with more msg types later
                }
            }
        });
    }

    onAuth(_client: Client, options: JoinOptions): boolean {
        if (!this.registryId) return false;
        return registry.validatePasscode(this.registryId, options.passcode);
    }

    onJoin(client: Client, options: JoinOptions): void {
        const player = new PlayerSchema();
        player.sessionId = client.sessionId;
        player.name = (options.name ?? "Anonymous").slice(0, 20); // limit name length
        player.color = colorForId(client.sessionId);
        this.state.players.set(client.sessionId, player);
        if (this.registryId) registry.setPlayerCount(this.registryId, this.state.players.size);
        console.log(`[room] +${client.sessionId} as ${player.name}`);
    }

    onLeave(client: Client): void {
        this.state.players.delete(client.sessionId);
        if (this.registryId) registry.setPlayerCount(this.registryId, this.state.players.size);
        console.log(`[room] -${client.sessionId} left`);
    }

    onDispose(): void {
        if (this.registryId) registry.remove(this.registryId);
    }
}