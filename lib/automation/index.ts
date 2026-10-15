import { claudeCodeDriver } from "./claude-code-driver";
import { simulatedDriver } from "./simulated-driver";
import type { ActivationDriver } from "./types";

/**
 * Resolves the active automation driver from LAZY_DRIVER:
 *   "claude-code"  recommended real driver, sends through the Claude Code CLI
 *   "playwright"   legacy real driver, drives the claude.ai web page
 *   anything else  the simulated driver, so the app runs anywhere
 * The Playwright driver is imported lazily so its heavy dependency never loads
 * unless it is selected.
 */
export function getDriver(): ActivationDriver {
  if (process.env.LAZY_DRIVER === "claude-code") {
    return claudeCodeDriver;
  }
  if (process.env.LAZY_DRIVER === "playwright") {
    // Late require keeps playwright out of the bundle unless it is selected.
    const { playwrightDriver } =
      require("./playwright-driver") as typeof import("./playwright-driver");
    return playwrightDriver;
  }
  return simulatedDriver;
}

export type {
  ActivateOptions,
  ActivationDriver,
  ActivationResult,
  ConnectResult,
} from "./types";
