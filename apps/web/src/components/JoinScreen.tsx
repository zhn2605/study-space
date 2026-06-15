import { useState, type SubmitEvent } from "react";
import type { JSX } from "react/jsx-runtime";
import { useSession } from "../state/session";

export function JoinScreen(): JSX.Element {
    const setName = useSession((s) => s.setName);
    const [draft, setDraft] = useState("");

    function submit(e: SubmitEvent<HTMLFormElement>): void {
        e.preventDefault();
        const trimmed = draft.trim();
        if (trimmed.length === 0) return;
        setName(trimmed);
    }

    return (
        <form onSubmit={submit} style={{padding: "1vh", fontFamily: "system-ui" }}>
            <h1>Study Space</h1>
            <label>
                Pick a name:
                <input
                    type="text"
                    value={draft}
                    autoFocus
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={20}
                />
            </label>
            <button type="submit" disabled={draft.trim().length === 0}>
                Continue
            </button>
        </form>
    )
}