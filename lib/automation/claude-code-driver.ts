import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { store } from "@/lib/store/file-store";
import type {
  ActivateOptions,
  ActivationDriver,
  ActivationResult,
  ConnectResult,
} from "./types";

/**
 * Recommended real driver. It opens a window by sending the activation message
 * through the official Claude Code CLI in headless mode (`claude -p`). On Pro
 * and Max plans Claude Code shares the same five hour usage window as
 * claude.ai, so one tiny message here starts the window everywhere.
 *
 * No browser, no scraped session, no bot protection: it authenticates either
 * with your local `claude` login or with a long lived token from
 * `claude setup-token`, passed as CLAUDE_CODE_OAUTH_TOKEN.
 *
 * Environment:
 *   LAZY_CLAUDE_BIN       path to the claude binary, default "claude"
 *   LAZY_CLAUDE_MODEL     model for the ping, default "haiku" (cheapest)
 *   LAZY_CLAUDE_TIMEOUT_MS  timeout for one ping, default 120000
 *   CLAUDE_CODE_OAUTH_TOKEN optional token from `claude setup-token`
 */

const BIN = process.env.LAZY_CLAUDE_BIN ?? "claude";
const MODEL = process.env.LAZY_CLAUDE_MODEL ?? "haiku";
const TIMEOUT = Number(process.env.LAZY_CLAUDE_TIMEOUT_MS) || 120000;

interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
}

function run(args: string[]): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(
      BIN,
      args,
      { cwd: tmpdir(), timeout: TIMEOUT, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout, stderr) => {
        resolve({ ok: !error, stdout: String(stdout), stderr: String(stderr) });
      },
    );
  });
}

/** True when CLI output reads like a missing or expired login. */
function looksUnauthenticated(text: string): boolean {
  return /not logged in|invalid api key|oauth|authenticat|\/login|401/i.test(
    text,
  );
}

/** True when CLI output reads like the usage limit is still in force. */
function looksRateLimited(text: string): boolean {
  return /usage limit|rate limit|limit reached|429/i.test(text);
}

class ClaudeCodeDriver implements ActivationDriver {
  readonly name = "claude-code";

  async connect(account = "Claude Code"): Promise<ConnectResult> {
    const version = await run(["--version"]);
    if (!version.ok) {
      const detail =
        "The claude command was not found. Install Claude Code and log in.";
      await store.setConnection({ connected: false, lastError: detail });
      return { connected: false, account: null, detail };
    }
    await store.setConnection({
      connected: true,
      account,
      connectedAt: new Date().toISOString(),
      lastError: null,
    });
    return {
      connected: true,
      account,
      detail: `Using ${version.stdout.trim()}. Messages go through your subscription.`,
    };
  }

  async disconnect(): Promise<void> {
    await store.setConnection({
      connected: false,
      account: null,
      connectedAt: null,
      lastError: null,
    });
  }

  async isConnected(): Promise<boolean> {
    const state = await store.read();
    return state.connection.connected;
  }

  async activate(options: ActivateOptions): Promise<ActivationResult> {
    const result = await run([
      "-p",
      options.message,
      "--model",
      MODEL,
      "--tools",
      "",
      "--no-session-persistence",
      "--setting-sources",
      "",
      "--output-format",
      "json",
    ]);

    let parsed: { is_error?: boolean; result?: string } | null = null;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      parsed = null;
    }

    const output = `${parsed?.result ?? ""}\n${result.stdout}\n${result.stderr}`;

    if (result.ok && parsed && !parsed.is_error) {
      return {
        status: "success",
        detail: `Sent "${options.message}" through Claude Code and started a fresh window.`,
      };
    }

    if (looksRateLimited(output)) {
      return {
        status: "failed",
        detail: "The current window is still exhausted. Will try again shortly.",
      };
    }

    if (looksUnauthenticated(output)) {
      const detail =
        "Claude Code is not logged in. Run claude setup-token and reconnect.";
      await store.setConnection({ connected: false, lastError: detail });
      return { status: "failed", detail, sessionExpired: true };
    }

    return {
      status: "failed",
      detail: "Claude Code could not send the message. Will try again shortly.",
    };
  }
}

const globalForDriver = globalThis as unknown as {
  __lazyClaudeCodeDriver?: ClaudeCodeDriver;
};

export const claudeCodeDriver: ActivationDriver =
  globalForDriver.__lazyClaudeCodeDriver ??
  (globalForDriver.__lazyClaudeCodeDriver = new ClaudeCodeDriver());
