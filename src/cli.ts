import { startServer } from "./server";
import { startClient } from "./client";

export function runCLI() {
  const command = process.argv[2];

  switch (command) {
    case "start":
      startServer();
      break;

    case "connect":
      startClient();
      break;

    default:
      console.log(`
Usage:
  broadcast-server start     Start the server
  broadcast-server connect   Connect as client
      `);
  }
}