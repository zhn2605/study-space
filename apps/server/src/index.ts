import { WebSocketTransport } from "@colyseus/ws-transport";
import { defineRoom, defineServer } from "colyseus";
import { configureApp } from "./http/app.js";
import { StudyRoom } from "./rooms/StudyRoom";

const PORT = Number(process.env.PORT ?? 2567);

const server = defineServer({
  transport: new WebSocketTransport(),
  rooms: {
    study_room: defineRoom(StudyRoom),
  },
  express: (app) => {
    configureApp(app);
  },
});

server.listen(PORT).then(() => {
  console.log(`[server] HTTP + Colyseus listening on :${PORT}`);
});

export { server };
