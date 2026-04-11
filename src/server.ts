import WebSocket, { WebSocketServer } from "ws";

const PORT = 3000;

type Message = {
  type: "message";
  user: string;
  text: string;
};

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });
  const clients = new Set<WebSocket>();

  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);

  wss.on("connection", (ws) => {
    console.log("✅ New client connected");

    clients.add(ws);

    ws.on("message", (data) => {
      console.log("RAW:", data.toString());

      try {
        const msg: Message = JSON.parse(data.toString());

        if (msg.type !== "message") return;

        const payload = JSON.stringify(msg);

        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        }
      } catch (err) {
        console.error("⚠️ Invalid message format");
      }
    });

    ws.on("close", () => {
      console.log("❌ Client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (err) => {
      console.error("⚠️ Client error:", err);
    });
  });
}