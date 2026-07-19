import { simulatedDriver } from "./simulated-driver";
import type { ActivationDriver } from "./types";

/**
 * Resolves the active automation driver. Today this is always the simulated
 * driver. When a real browser driver is added, select it here, for example
 * based on an environment flag, without changing any callers.
 */
export function getDriver(): ActivationDriver {
  return simulatedDriver;
}

export type {
  ActivateOptions,
  ActivationDriver,
  ActivationResult,
  ConnectResult,
} from "./types";
