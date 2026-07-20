import { simulatedDriver } from "./simulated-driver";
import type { ActivationDriver } from "./types";

/**
 * Resolves the active automation driver from LAZY_DRIVER. Defaults to the
 * simulated driver so the app runs anywhere; set LAZY_DRIVER=playwright on your
 * always on host to drive a real claude.ai session. The Playwright driver is
 * imported lazily so its heavy dependency never loads in the simulated path.
 */
export function getDriver(): ActivationDriver {
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
