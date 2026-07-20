/**
 * Uploads the captured claude-session.json to your running server.
 *
 *   SERVER_URL=https://your-app.onrender.com ADMIN_TOKEN=your-token \
 *     npm run upload-session
 *
 * SERVER_URL defaults to http://localhost:3000 for local testing.
 */
import { readFileSync } from "node:fs";

const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:3000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const FILE = process.env.SESSION_FILE ?? "claude-session.json";

if (!ADMIN_TOKEN) {
  console.error("Set ADMIN_TOKEN to the same value configured on the server.");
  process.exit(1);
}

let storageState;
try {
  storageState = readFileSync(FILE, "utf8");
  JSON.parse(storageState); // validate
} catch {
  console.error(
    `Could not read ${FILE}. Run "npm run capture-session" first.`,
  );
  process.exit(1);
}

const res = await fetch(`${SERVER_URL.replace(/\/$/, "")}/api/session`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
  body: JSON.stringify({ storageState }),
});

const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`Upload failed (${res.status}): ${data.error ?? "unknown error"}`);
  process.exit(1);
}
console.log(data.detail ?? "Session uploaded.");
