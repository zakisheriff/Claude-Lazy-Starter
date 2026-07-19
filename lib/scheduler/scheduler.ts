import { runActivation } from "@/lib/automation/service";
import { decideAutoActivation } from "@/lib/domain/activation";
import { computeWindow } from "@/lib/domain/window";
import { store } from "@/lib/store/file-store";

/**
 * A single in-process scheduler. Every tick it checks whether a fresh window
 * should be opened during your sleep hours and, if so, runs an activation.
 * Started once from instrumentation.ts. This is deliberately simple; a
 * production deployment would move this to a durable job runner.
 */

const TICK_MS = 60_000;

interface SchedulerHandle {
  timer: ReturnType<typeof setInterval> | null;
  running: boolean;
}

const globalForScheduler = globalThis as unknown as {
  __lazyScheduler?: SchedulerHandle;
};

const handle: SchedulerHandle =
  globalForScheduler.__lazyScheduler ??
  (globalForScheduler.__lazyScheduler = { timer: null, running: false });

export async function tick(): Promise<void> {
  if (handle.running) return;
  handle.running = true;
  try {
    const state = await store.read();
    const view = computeWindow(state);
    const decision = decideAutoActivation(state, view);
    if (decision.shouldActivate) {
      await runActivation("auto");
    } else {
      await store.setScheduler({ lastRunAt: new Date().toISOString() });
    }
  } catch {
    // A failed tick must never crash the process; the next tick retries.
  } finally {
    handle.running = false;
  }
}

export function startScheduler(): void {
  if (handle.timer) return;
  // Run once shortly after boot, then on the interval.
  handle.timer = setInterval(() => void tick(), TICK_MS);
  setTimeout(() => void tick(), 4_000);
}

export function isSchedulerLive(): boolean {
  return handle.timer !== null;
}
