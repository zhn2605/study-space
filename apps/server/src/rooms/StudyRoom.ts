import { Room, type Client } from "colyseus";
import { PlayerSchema, RoomStateSchema } from "./schema.js";
import { validateClientInput } from "./validation";

type JoinOptions = { 
    name?: string; 
    countryCode?: string; 
    password?: string 
};

type CreateOptions = { 
    name?: string; 
    isPublic?: boolean; 
    password?: string 
};

export class StudyRoom extends Room {
    maxClients: number = 15;
    state = new RoomStateSchema();

    onCreate(options: CreateOptions): void {
        this.state.name = options.name ?? "Cafe";
        this.state.isPublic = options.isPublic ?? true;
        this.state.password = options.password ?? "";

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

    onJoin(client: Client, options: JoinOptions): void {
        const player = new PlayerSchema();
        player.sessionId = client.sessionId;
        player.name = (options.name ?? "Anonymous").slice(0, 20); // limit name length
        this.state.players.set(client.sessionId, player);
        console.log(`[room] +${client.sessionId} as ${player.name}`);
    }

    onLeave(client: Client): void {
        this.state.players.delete(client.sessionId);
        console.log(`[room] -${client.sessionId} left`);
    }
}