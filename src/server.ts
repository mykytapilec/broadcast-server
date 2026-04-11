import WebSocket, { WebSocketServer } from "ws";

const PORT = 3000;

type ClientToServerMessage =
  | { type: "join"; user: string; room: string }
  | { type: "message"; text: string };

type ServerToClientMessage =
  | { type: "system"; text: string }
  | { type: "message"; user: string; text: string };

type ClientInfo = {
  user: string;
  room: string;
};

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  const clients = new Map<WebSocket, ClientInfo>();

  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);

  function broadcast(room: string, msg: ServerToClientMessage) {
    const data = JSON.stringify(msg);

    for (const [client, info] of clients.entries()) {
      if (info.room !== room) continue;

      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  wss.on("connection", (ws) => {
    console.log("✅ Client connected");

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as ClientToServerMessage;

        /**
         * JOIN ROOM
         */
        if (msg.type === "join") {
          clients.set(ws, {
            user: msg.user,
            room: msg.room,
          });

          broadcast(msg.room, {
            type: "system",
            text: `${msg.user} joined #${msg.room}`,
          });

          return;
        }

        /**
         * MESSAGE
         */
        if (msg.type === "message") {
          const info = clients.get(ws);
          if (!info) return;

          broadcast(info.room, {
            type: "message",
            user: info.user,
            text: msg.text,
          });
        }
      } catch (err) {
        console.error("Invalid message:", err);
      }
    });

    ws.on("close", () => {
      const info = clients.get(ws);
      clients.delete(ws);

      if (info) {
        broadcast(info.room, {
          type: "system",
          text: `${info.user} left #${info.room}`,
        });
      }

      console.log("❌ Client disconnected");
    });
  });
}