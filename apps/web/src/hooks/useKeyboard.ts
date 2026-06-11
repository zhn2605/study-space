import { useEffect, useRef } from "react";

const TRACKED_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD"];

export type KeysRef = React.RefObject<Set<string>>;

export function useKeyboard(): KeysRef  {
    const keys = useRef<Set<string>>(new Set());

    useEffect(() => {
        function down(e: KeyboardEvent): void {
            if (TRACKED_KEYS.includes(e.code)) keys.current.add(e.code);
        }
        function up(e: KeyboardEvent): void {
            keys.current.delete(e.code);
        }

        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        }
    }, [])
    return keys;
}