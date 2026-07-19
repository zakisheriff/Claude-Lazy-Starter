import type { AppState } from "@/lib/store/types";
import { isWithinRange } from "./schedule";
import type { WindowView } from "./window";

/**
 * Decides whether the scheduler should open a fresh window right now. The rule
 * mirrors the product idea: only act when a window is genuinely available, the
 * account is connected, automation is on, and you are inside your sleep hours,
 * and never open the same available window twice.
 */

export interface AutoDecision {
  shouldActivate: boolean;
  reason: string;
}

export function decideAutoActivation(
  state: AppState,
  view: WindowView,
  now: Date = new Date(),
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
      reason: "A window is already active.",
    };
  }
  if (scheduler.lastActivatedWindowKey === view.windowKey) {
    return {
      shouldActivate: false,
      reason: "This window was already started.",
    };
  }
  if (!isWithinRange(now, settings.sleepHours)) {
    return {
      shouldActivate: false,
      reason: "Outside your sleep hours, leaving the window for you.",
    };
  }
  return {
    shouldActivate: true,
    reason: "A fresh window is available during sleep hours.",
  };
}

let counter = 0;
export function activationId(now: Date = new Date()): string {
  counter = (counter + 1) % 100000;
  return `act_${now.getTime().toString(36)}_${counter.toString(36)}`;
}
