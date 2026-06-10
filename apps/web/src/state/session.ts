import { create } from "zustand";

type SessionStore = {
    name: string | null;
    setName: (n: string) => void;
};

export const useSession = create<SessionStore>((set) => ({
    name: null,
    setName: (n: string) => set({ name: n.slice(0, 20) }),
}) );