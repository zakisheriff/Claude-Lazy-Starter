import type { ActivationRecord, AppState, Settings } from "@/lib/store/types";

/**
 * A usage window is opened by an activation and lasts windowHours. Once it
 * ends, a fresh window becomes available. These pure functions derive the
 * current window and the next availability from stored state, so the same
 * logic drives the dashboard, the scheduler, and any tests.
 */

export interface WindowView {
  active: boolean;
  /** A fresh window can be started right now. */
  availableNow: boolean;
  startedAt: string | null;
  endsAt: string | null;
  totalMs: number;
  elapsedMs: number;
  remainingMs: number;
  /** Progress through the active window, 0 to 1. */
  progress: number;
  /** When the next fresh window becomes available. */
  nextAvailableAt: string;
  /** Stable identifier for the currently available fresh window. */
  windowKey: string;
  lastActivation: ActivationRecord | null;
}

function lastSuccessful(state: AppState): ActivationRecord | null {
  return state.activations.find((a) => a.status === "success") ?? null;
}

export function windowLengthMs(settings: Settings): number {
  return Math.max(1, settings.windowHours) * 60 * 60 * 1000;
}

export function computeWindow(state: AppState, now: Date = new Date()): WindowView {
  const nowMs = now.getTime();
  const total = windowLengthMs(state.settings);
  const last = lastSuccessful(state);

  if (last) {
    const start = new Date(last.at).getTime();
    const end = start + total;
    if (nowMs < end) {
      const elapsed = nowMs - start;
      return {
        active: true,
        availableNow: false,
        startedAt: new Date(start).toISOString(),
        endsAt: new Date(end).toISOString(),
        totalMs: total,
        elapsedMs: elapsed,
        remainingMs: end - nowMs,
        progress: Math.min(1, Math.max(0, elapsed / total)),
        nextAvailableAt: new Date(end).toISOString(),
        // The fresh window that opens when this one ends.
        windowKey: `w:${new Date(end).toISOString()}`,
        lastActivation: last,
      };
    }
    // Previous window has ended, a fresh one has been available since then.
    return {
      active: false,
      availableNow: true,
      startedAt: null,
      endsAt: null,
      totalMs: total,
      elapsedMs: 0,
      remainingMs: 0,
      progress: 0,
      nextAvailableAt: new Date(nowMs).toISOString(),
      windowKey: `w:${new Date(end).toISOString()}`,
      lastActivation: last,
    };
  }

  // Never activated. A fresh window is available now.
  return {
    active: false,
    availableNow: true,
    startedAt: null,
    endsAt: null,
    totalMs: total,
    elapsedMs: 0,
    remainingMs: 0,
    progress: 0,
    nextAvailableAt: new Date(nowMs).toISOString(),
    windowKey: "w:genesis",
    lastActivation: null,
  };
}
