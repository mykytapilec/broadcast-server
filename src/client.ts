import WebSocket from "ws";
import readline from "readline";

const URL = "ws://127.0.0.1:3000";

type ServerMessage =
  | { type: "system"; text: string }
  | { type: "message"; user: string; text: string };

export function startClient() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter username: ", (user) => {
    rl.question("Enter room (e.g. general): ", (room) => {
      const ws = new WebSocket(URL);

      ws.on("open", () => {
        console.log(`\n🔌 Connected as ${user} in #${room}\n`);

        ws.send(
          JSON.stringify({
            type: "join",
            user,
            room,
          })
        );

        rl.on("line", (text) => {
          if (!text.trim()) return;

          ws.send(
            JSON.stringify({
              type: "message",
              text,
            })
          );
        });
      });

      ws.on("message", (raw) => {
        const msg = JSON.parse(raw.toString()) as ServerMessage;

        if (msg.type === "system") {
          console.log(`⚡ ${msg.text}`);
          return;
        }

        if (msg.type === "message") {
          console.log(`[${msg.user}]: ${msg.text}`);
        }
      });

      ws.on("close", () => {
        console.log("❌ Disconnected");
        process.exit(0);
      });

      ws.on("error", (err) => {
        console.error("WS error:", err);
      });

      process.on("SIGINT", () => {
        ws.close();
        rl.close();
        process.exit(0);
      });
    });
  });
}