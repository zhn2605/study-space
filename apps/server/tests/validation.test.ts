import { describe, expect, it } from "vitest";
import { validateClientInput } from "../src/rooms/validation.js";

describe("validateClientInput", () => {
    it("accepts a well-formed move", () => {
        const ok = validateClientInput({
            t: "move",
            pos: { x: 1, y: 0, z: -2 },
            rotY: 0.5,
        });
        expect(ok).toBe(true);
    });

    it("accepts timer messages", () => {
        expect(validateClientInput({ t: "timer.start" })).toBe(true);
        expect(validateClientInput({ t: "timer.pause" })).toBe(true);
        expect(validateClientInput({ t: "timer.reset" })).toBe(true);
        expect(validateClientInput({ t: "timer.set", durationSec: 1500 })).toBe(true);
    });

    it("rejects unknown discriminator", () => {
        expect(validateClientInput({ t: "cat.explode" })).toBe(false);
    });

    it("rejects malformed move", () => {
        expect(validateClientInput({ t: "move", pos: { x: 1, y: 0 }, rotY: 0 })).toBe(false);
        expect(validateClientInput({ t: "move", pos: { x: "a", y: 0, z: 0 }, rotY: 0 })).toBe(false);
        expect(validateClientInput({ t: "move" })).toBe(false);
    });

    it("rejects malformed timer.set", () => {
        expect(validateClientInput({ t: "timer.set" })).toBe(false);
        expect(validateClientInput({ t: "timer.set", durationSec: -1 })).toBe(false);
        expect(validateClientInput({ t: "timer.set", durationSec: "25" })).toBe(false);
    });

    it("rejects non-objects", () => {
        expect(validateClientInput(null)).toBe(false);
        expect(validateClientInput("hi")).toBe(false);
        expect(validateClientInput(42)).toBe(false);
    });
});
