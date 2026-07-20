import type { BrowserContextOptions } from "playwright";
import { store } from "@/lib/store/file-store";
import type {
  ActivateOptions,
  ActivationDriver,
  ActivationResult,
  ConnectResult,
} from "./types";

type StoredState = BrowserContextOptions["storageState"];

/**
 * Real automation driver. It drives a headless Chromium session against your
 * own claude.ai account using a previously captured login (Playwright storage
 * state). This is the piece that actually sends the activation message while
 * you sleep, so it must run on an always on host, never a laptop that closes.
 *
 * Honest limits: claude.ai sits behind bot protection that can challenge or
 * block automated browsers, especially from datacenter IPs, and the page's
 * selectors change over time. The selectors below are best effort with
 * fallbacks and are overridable by environment variable.
 *
 * Environment:
 *   LAZY_CLAUDE_URL       base url, default https://claude.ai
 *   LAZY_HEADLESS         "false" to watch the browser locally, default true
 *   LAZY_NAV_TIMEOUT_MS   navigation timeout, default 45000
 *   LAZY_COMPOSER_SELECTOR / LAZY_SEND_SELECTOR  selector overrides
 */

const BASE_URL = (process.env.LAZY_CLAUDE_URL ?? "https://claude.ai").replace(
  /\/$/,
  "",
);
const NAV_TIMEOUT = Number(process.env.LAZY_NAV_TIMEOUT_MS) || 45000;
const HEADLESS = process.env.LAZY_HEADLESS !== "false";

const COMPOSER_SELECTORS = [
  process.env.LAZY_COMPOSER_SELECTOR,
  'div[contenteditable="true"].ProseMirror',
  'div.ProseMirror[contenteditable="true"]',
  'div[contenteditable="true"]',
  'textarea[data-testid="chat-input"]',
  "textarea",
].filter(Boolean) as string[];

const SEND_SELECTORS = [
  process.env.LAZY_SEND_SELECTOR,
  'button[aria-label="Send message"]',
  'button[aria-label="Send Message"]',
  'button[data-testid="send-button"]',
  'button[type="submit"]',
].filter(Boolean) as string[];

// Chromium flags that make it run in a container and look less automated.
const LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-blink-features=AutomationControlled",
];

type PwModule = typeof import("playwright");

async function getChromium(): Promise<PwModule["chromium"]> {
  const { chromium } = (await import("playwright")) as PwModule;
  return chromium;
}

/** True when the current page looks like the Claude login wall. */
function looksLoggedOut(url: string): boolean {
  return /\/login|\/magic-link|\/auth|account\.anthropic/i.test(url);
}

class PlaywrightDriver implements ActivationDriver {
  readonly name = "playwright";

  private async loadStorageState(): Promise<StoredState | null> {
    const state = await store.read();
    if (!state.session.storageState) return null;
    try {
      return JSON.parse(state.session.storageState) as StoredState;
    } catch {
      return null;
    }
  }

  async isConnected(): Promise<boolean> {
    const state = await store.read();
    return Boolean(state.session.storageState) && state.connection.connected;
  }

  /** Verify the captured session by loading Claude and checking we are in. */
  async connect(): Promise<ConnectResult> {
    const storageState = await this.loadStorageState();
    if (!storageState) {
      return {
        connected: false,
        account: null,
        detail:
          "No saved session found. Run the capture script locally and upload your session first.",
      };
    }

    const chromium = await getChromium();
    const browser = await chromium.launch({ headless: HEADLESS, args: LAUNCH_ARGS });
    try {
      const context = await browser.newContext({ storageState });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/new`, {
        waitUntil: "domcontentloaded",
        timeout: NAV_TIMEOUT,
      });
      await page.waitForTimeout(2500);

      if (looksLoggedOut(page.url())) {
        await store.setConnection({
          connected: false,
          lastError: "The saved session is no longer signed in. Capture a fresh one.",
        });
        return {
          connected: false,
          account: null,
          detail: "The saved session is signed out. Capture and upload a fresh session.",
        };
      }

      // Refresh the stored session so cookies stay current.
      const refreshed = await context.storageState();
      await store.setSession({
        storageState: JSON.stringify(refreshed),
        capturedAt: new Date().toISOString(),
      });
      await store.setConnection({
        connected: true,
        account: "Claude web account",
        connectedAt: new Date().toISOString(),
        lastError: null,
      });
      return {
        connected: true,
        account: "Claude web account",
        detail: "Signed in and ready.",
      };
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Could not reach claude.ai.";
      await store.setConnection({ connected: false, lastError: detail });
      return { connected: false, account: null, detail };
    } finally {
      await browser.close();
    }
  }

  async disconnect(): Promise<void> {
    await store.setSession({ storageState: null, capturedAt: null });
    await store.setConnection({
      connected: false,
      account: null,
      connectedAt: null,
      lastError: null,
    });
  }

  async activate(options: ActivateOptions): Promise<ActivationResult> {
    const storageState = await this.loadStorageState();
    if (!storageState) {
      return {
        status: "failed",
        detail: "No saved session. Upload your captured Claude session first.",
        sessionExpired: true,
      };
    }

    const chromium = await getChromium();
    const browser = await chromium.launch({ headless: HEADLESS, args: LAUNCH_ARGS });
    try {
      const context = await browser.newContext({ storageState });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/new`, {
        waitUntil: "domcontentloaded",
        timeout: NAV_TIMEOUT,
      });
      await page.waitForTimeout(2000);

      if (looksLoggedOut(page.url())) {
        await store.setConnection({
          connected: false,
          lastError: "The session expired. Capture and upload a fresh one.",
        });
        return {
          status: "failed",
          detail: "The session was signed out before the message could be sent.",
          sessionExpired: true,
        };
      }

      // Find the composer.
      let composer = null;
      for (const selector of COMPOSER_SELECTORS) {
        const found = page.locator(selector).first();
        if (await found.count()) {
          composer = found;
          break;
        }
      }
      if (!composer) {
        return {
          status: "failed",
          detail:
            "Could not find the message box. Claude's page may have changed; update the composer selector.",
        };
      }

      await composer.click();
      await composer.type(options.message, { delay: 25 });

      // Send: try a send button, then fall back to Enter.
      let sent = false;
      for (const selector of SEND_SELECTORS) {
        const button = page.locator(selector).first();
        if ((await button.count()) && (await button.isEnabled().catch(() => false))) {
          await button.click();
          sent = true;
          break;
        }
      }
      if (!sent) {
        await page.keyboard.press("Enter");
      }

      // Confirm the message went in: the app moves to a chat url or shows the
      // sent message. Best effort, with a short wait.
      await page
        .waitForURL(/\/chat\//, { timeout: 15000 })
        .catch(() => undefined);
      await page.waitForTimeout(1500);

      // Keep the session fresh for next time.
      const refreshed = await context.storageState();
      await store.setSession({
        storageState: JSON.stringify(refreshed),
        capturedAt: new Date().toISOString(),
      });

      const started = /\/chat\//.test(page.url());
      return {
        status: "success",
        detail: started
          ? `Sent "${options.message}" and started a fresh window.`
          : "Sent the activation message. Could not fully confirm the new chat, but the window should be open.",
      };
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "The activation attempt failed.";
      return { status: "failed", detail };
    } finally {
      await browser.close();
    }
  }
}

const globalForPw = globalThis as unknown as { __lazyPwDriver?: PlaywrightDriver };

export const playwrightDriver: ActivationDriver =
  globalForPw.__lazyPwDriver ??
  (globalForPw.__lazyPwDriver = new PlaywrightDriver());
