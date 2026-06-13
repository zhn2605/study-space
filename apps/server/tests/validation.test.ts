import { describe, expect, it } from "vitest";
import { validateClientInput } from "../src/rooms/validation.js";

describe("validateClientInput", () => {
    it("accepts a well-formed move", () => {
        const ok = validateClientInput({
            type: "move",
            position: { x: 1, y: 0, z: -2 },
            rotationY: 0.5,
        });
        expect(ok).toBe(true);
    });

    it("accepts timer messages", () => {
        expect(validateClientInput({ type: "timer.start" })).toBe(true);
        expect(validateClientInput({ type: "timer.pause" })).toBe(true);
        expect(validateClientInput({ type: "timer.reset" })).toBe(true);
        expect(validateClientInput({ type: "timer.set", durationSec: 1500 })).toBe(true);
    });

    it("rejects unknown discriminator", () => {
        expect(validateClientInput({ type: "cat.explode" })).toBe(false);
    });

    it("rejects malformed move", () => {
        expect(validateClientInput({ type: "move", position: { x: 1, y: 0 }, rotationY: 0 })).toBe(false);
        expect(validateClientInput({ type: "move", position: { x: "a", y: 0, z: 0 }, rotationY: 0 })).toBe(false);
        expect(validateClientInput({ type: "move" })).toBe(false);
    });

    it("rejects malformed timer.set", () => {
        expect(validateClientInput({ type: "timer.set" })).toBe(false);
        expect(validateClientInput({ type: "timer.set", durationSec: -1 })).toBe(false);
        expect(validateClientInput({ type: "timer.set", durationSec: "25" })).toBe(false);
    });

    it("rejects non-objects", () => {
        expect(validateClientInput(null)).toBe(false);
        expect(validateClientInput("hi")).toBe(false);
        expect(validateClientInput(42)).toBe(false);
    });

    it("rejects the legacy shorthand shape (regression for the drift fix)", () => {
        expect(validateClientInput({ t: "move", pos: { x: 0, y: 0, z: 0 }, rotY: 0 })).toBe(false);
    });
});