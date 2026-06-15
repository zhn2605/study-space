import type { RoomSummary } from "@study-space/shared";
import { create } from "zustand";
import { listPublicRooms } from "../net/colyseusClient";

type LobbyStore = {
    rooms: RoomSummary[];
    loading: boolean;
    refresh: () => Promise<void>;
};

export const useLobby = create<LobbyStore>((set) => ({
    rooms: [],
    loading: false,
    refresh: async () => {
        set({ loading: true });
        try {
            const rooms = await listPublicRooms();
            set({ rooms, loading: false });
        } catch {
            set({ loading: false });
        }
    }
}));