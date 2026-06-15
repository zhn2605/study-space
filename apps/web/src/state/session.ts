import { create } from "zustand";

type SessionStore = {
    name: string | null;
    roomId: string | null;
    passcode: string | null;
    setName: (n: string) => void;
    setRoom: (roomId: string, passcode?: string) => void;
    leaveRoom: () => void;
};

export const useSession = create<SessionStore>((set) => ({
    name: null,
    roomId: null,
    passcode: null,
    setName: (n) => set({ name: n.slice(0, 32) }),
    setRoom: (roomId, passcode) => set({ roomId, passcode: passcode ?? null }),
    leaveRoom: () => set({ roomId: null, passcode: null }),
}));