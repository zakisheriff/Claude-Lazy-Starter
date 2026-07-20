/**
 * One time session capture. Run this on your own computer:
 *
 *   npm run capture-session
 *
 * A real Chromium window opens on claude.ai. Log in exactly as you normally
 * would (email, Google, whatever you use). Once you can see your chats, come
 * back to this terminal and press Enter. Your session is written to
 * claude-session.json, which you then upload to your always on server.
 *
 * This file is your login. Treat it like a password: never commit it, never
 * share it. It is already covered by .gitignore.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const OUT = "claude-session.json";
const URL = process.env.LAZY_CLAUDE_URL ?? "https://claude.ai";

function waitForEnter(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, () => {
    rl.close();
    resolve();
  }));
}

const browser = await chromium.launch({
  headless: false,
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext();
const page = await context.newPage();

console.log("\nOpening claude.ai. Log in in the browser window that appears.");
await page.goto(`${URL}/login`, { waitUntil: "domcontentloaded" });

await waitForEnter(
  "\nWhen you are fully logged in and can see your chats, press Enter here to save the session. ",
);

await context.storageState({ path: OUT });
await browser.close();

console.log(`\nSaved your session to ${OUT}.`);
console.log("\nNow upload it to your server:");
console.log(
  "  SERVER_URL=https://your-app.onrender.com ADMIN_TOKEN=your-token \\\n    npm run upload-session",
);
console.log(
  "\nThen open the dashboard and press Connect to verify. Keep claude-session.json private and delete it when done.\n",
);
