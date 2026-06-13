import type { JSX } from "react";
import { JoinScreen } from "./components/JoinScreen";
import { useRoom } from "./net/useRoom";
import { Scene } from "./scene/Scene";
import { useSession } from "./state/session";

export default function App(): JSX.Element {
  const name = useSession((s) => s.name);
  const room = useRoom(name);

  if (!name) return <JoinScreen />;
  if (!room) return <div style={{ padding: 24}}>Connecting...</div>;
  return <Scene room={room} />;
}