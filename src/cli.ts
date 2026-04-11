import { startServer } from "./server";
import { startClient } from "./client";

export function runCLI() {
  const cmd = process.argv[2];

  if (cmd === "start") return startServer();
  if (cmd === "connect") return startClient();

  console.log(`
Usage:
  start     - run server
  connect   - run client
  `);
}