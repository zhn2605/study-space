import { beforeEach, describe, it } from "node:test";
import { expect } from "vitest";
import { RoomRegistry } from "../src/rooms/registry";

let reg: RoomRegistry;
beforeEach(() => {
    reg = new RoomRegistry();
});

describe("RoomRegistry", () => {
    it("creates a public room and lists it", () => {
        const { id } = reg.create({ name: "Cafe A", isPublic: true });
        expect(reg.listPublic()).toEqual([
            { id, name: "Cafe A", playerCount: 0 },
        ]);
    });

    it("creates a passcode room and hides it from public", () => {
        reg.create({name: "Cafe B", passcode: "knockknock", isPublic: false});
        expect(reg.listPublic()).toEqual([]);
    });

    it("validates passcode on demand", () => {
        const { id } = reg.create({ name: "Cafe?", isPublic: false, passcode: "pleaseletmein" });
        expect(reg.validatePasscode(id, "pleaseletmein")).toBe(true);
        expect(reg.validatePasscode(id, "wrong")).toBe(false);
        expect(reg.validatePasscode("nope", "letmein")).toBe(false);
    });

    it ("tracks player count via setPlayerCount", () => {
        const { id } = reg.create({ name: "Caff..", isPublic: true });
        reg.setPlayerCount(id, 3);
        expect(reg.listPublic()[0]?.playerCount).toBe(3);
    });

    it("removes a room", () => {
        const { id } = reg.create({ name: "C", isPublic: true });
        reg.remove(id);
        expect(reg.listPublic()).toEqual([]);
        expect(reg.validatePasscode(id, undefined)).toBe(false);
    });

    it("rejects empty room names", () => {
        expect(() => reg.create({ name: "", isPublic: true })).toThrow();
        expect(() => reg.create({ name: "   ", isPublic: true })).toThrow();
    });

    it("rejects passcode rooms without a passcode", () => {
        expect(() => reg.create({ name: "X", isPublic: false })).toThrow();
    });
})