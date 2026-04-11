import WebSocket, { WebSocketServer } from "ws";

const PORT = 3000;

export function startServer() {
  const wss = new WebSocketServer({ port: PORT });

  const clients = new Set<WebSocket>();

  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);

  wss.on("connection", (ws) => {
    console.log("✅ New client connected");
    clients.add(ws);

    ws.on("message", (data) => {
      const message = data.toString();
      console.log(`📩 Received: ${message}`);

      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
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

  wss.on("error", (err) => {
    console.error("🔥 Server error:", err);
  });
}