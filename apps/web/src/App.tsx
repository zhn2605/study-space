import type { JSX } from "react";
import { HUD } from "./components/HUD";
import { JoinScreen } from "./components/JoinScreen";
import { Lobby } from "./components/Lobby";
import { useRoom } from "./net/useRoom";
import { Scene } from "./scene/Scene";
import { useSession } from "./state/session";

export default function App(): JSX.Element {
  const name = useSession((s) => s.name);
  const roomId = useSession((s) => s.roomId);
  const passcode = useSession((s) => s.passcode);
  const leaveRoom = useSession((s) => s.leaveRoom);
  const { bundle, error } = useRoom(name, roomId, passcode);

  if (!name) return <JoinScreen />;
  if (!roomId) return <Lobby />;
  if (error) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480 }}>
        <h2>Could not join room</h2>
        <p style={{ color: "tomato" }}>{error}</p>
        <button onClick={leaveRoom}>Back to lobby</button>
      </div>
    );
  }
  if (!bundle) return <div style={{ padding: 24 }}>Connecting...</div>;
  return (
    <>
      <Scene room={bundle.room} players={bundle.players} />
      <HUD room={bundle.room} players={bundle.players} />
    </>
  );
}
