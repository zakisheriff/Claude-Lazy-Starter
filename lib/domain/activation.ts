import type { AppState } from "@/lib/store/types";
import type { WindowView } from "./window";

/**
 * Decides whether to open a fresh window right now. The rule is deliberately
 * simple: the moment the current window ends, a new one is available, so start
 * it. That keeps a window always running, so whenever you sit down there is
 * time left on the current one and a full window waiting after it. It only acts
 * when automation is on, the account is connected, and the same window has not
 * already been started.
 */

export interface AutoDecision {
  shouldActivate: boolean;
  reason: string;
}

export function decideAutoActivation(
  state: AppState,
  view: WindowView,
): AutoDecision {
  const { settings, scheduler, connection } = state;

  if (!settings.autoActivation || !scheduler.enabled) {
    return { shouldActivate: false, reason: "Automatic activation is off." };
  }
  if (!connection.connected) {
    return { shouldActivate: false, reason: "No account is connected." };
  }
  if (!view.availableNow) {
    return {
      shouldActivate: false,
      reason: "A window is active. The next one starts the moment it ends.",
    };
  }
  if (scheduler.lastActivatedWindowKey === view.windowKey) {
    return {
      shouldActivate: false,
      reason: "This window was already started. Waiting for it to finish.",
    };
  }
  return {
    shouldActivate: true,
    reason: "A fresh window is available. Starting it now.",
  };
}

let counter = 0;
export function activationId(now: Date = new Date()): string {
  counter = (counter + 1) % 100000;
  return `act_${now.getTime().toString(36)}_${counter.toString(36)}`;
}
