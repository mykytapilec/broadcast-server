import WebSocket from "ws";
import readline from "readline";

const URL = "ws://127.0.0.1:3000";

type Message = {
  type: "message";
  user: string;
  text: string;
};

export function startClient() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your username: ", (username) => {
    console.log(`\n🔌 Connecting as ${username}...\n`);

    const ws = new WebSocket(URL);

    ws.on("open", () => {
      console.log("WS OPENED");
      console.log("✅ Connected!");
      console.log("💬 Type messages:\n");

      rl.on("line", (text) => {
        const msg: Message = {
          type: "message",
          user: username,
          text,
        };

        ws.send(JSON.stringify(msg));
      });
    });

    ws.on("message", (data) => {
      try {
        const msg: Message = JSON.parse(data.toString());
        console.log(`[${msg.user}]: ${msg.text}`);
      } catch {
        console.log(data.toString());
      }
    });

    ws.on("close", () => {
      console.log("❌ Disconnected");
      process.exit(0);
    });

    ws.on("error", (err) => {
      console.error("⚠️ Error:", err);
    });

    process.on("SIGINT", () => {
      console.log("\n👋 Closing connection...");
      ws.close();
      rl.close();
      process.exit(0);
    });
  });
}