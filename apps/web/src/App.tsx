import type { JSX } from "react";
import { JoinScreen } from "./components/JoinScreen";
import { Lobby } from "./components/Lobby";
import { PlayerList } from "./components/PlayerList";
import { useRoom } from "./net/useRoom";
import { Scene } from "./scene/Scene";
import { useSession } from "./state/session";

export default function App(): JSX.Element {
  const name = useSession((s) => s.name);
  const roomId = useSession((s) => s.roomId);
  const passcode = useSession((s) => s.passcode);
  const bundle = useRoom(name, roomId, passcode);

  if (!name) return <JoinScreen />;
  if (!roomId) return <Lobby />;
  if (!bundle) return <div style={{ padding: 24 }}>Connecting...</div>;
  return (
    <>
      <Scene room={bundle.room} players={bundle.players} />
      <PlayerList players={bundle.players} selfId={bundle.room.sessionId} />
    </>
  );
}
