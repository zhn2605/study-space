import { WebSocketTransport } from "@colyseus/ws-transport";
import { defineServer } from "colyseus";
import { configureApp } from "./http/app.js";

const PORT = Number(process.env.PORT ?? 2567);

const server = defineServer({
  transport: new WebSocketTransport(),
  rooms: {
    
  },
  express: (app) => {
    configureApp(app);
  },
});

server.listen(PORT).then(() => {
  console.log(`[server] HTTP + Colyseus listening on :${PORT}`);
});

export { server };
