import type { JSX } from "react";
import { JoinScreen } from "./components/JoinScreen";
import { PlayerList } from "./components/PlayerList";
import { useRoom } from "./net/useRoom";
import { Scene } from "./scene/Scene";
import { useSession } from "./state/session";

export default function App(): JSX.Element {
  const name = useSession((s) => s.name);
  const bundle = useRoom(name);

  if (!name) return <JoinScreen />;
  if (!bundle) return <div style={{ padding: 24 }}>Connecting...</div>;
  return (
    <>
      <Scene room={bundle.room} players={bundle.players} />
      <PlayerList players={bundle.players} selfId={bundle.room.sessionId} />
    </>
  );
}
