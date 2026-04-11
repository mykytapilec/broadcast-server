import WebSocket from "ws";
import readline from "readline";

const URL = "ws://localhost:3000";

export function startClient() {
  const ws = new WebSocket(URL);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  ws.on("open", () => {
    console.log("🔌 Connected to server");
    console.log("💬 Type your message and press Enter\n");

    rl.on("line", (input) => {
      ws.send(input);
    });
  });

  ws.on("message", (data) => {
    console.log(`📩 ${data.toString()}`);
  });

  ws.on("close", () => {
    console.log("❌ Disconnected from server");
    process.exit(0);
  });

  ws.on("error", (err) => {
    console.error("⚠️ Connection error:", err);
  });
}