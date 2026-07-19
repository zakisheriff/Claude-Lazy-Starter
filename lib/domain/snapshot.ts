import "server-only";
import { decideAutoActivation } from "@/lib/domain/activation";
import { computeWindow, type WindowView } from "@/lib/domain/window";
import { store } from "@/lib/store/file-store";
import type {
  ActivationRecord,
  ConnectionState,
  Settings,
} from "@/lib/store/types";

/**
 * The shape the dashboard consumes. Built once on the server and reused by the
 * page and by the API routes so the client always receives a consistent view.
 */
export interface DashboardSnapshot {
  now: string;
  connection: ConnectionState;
  settings: Settings;
  scheduler: { enabled: boolean; lastRunAt: string | null };
  window: WindowView;
  activations: ActivationRecord[];
  autoStatus: { active: boolean; reason: string };
}

export async function getSnapshot(): Promise<DashboardSnapshot> {
  const state = await store.read();
  const now = new Date();
  const window = computeWindow(state, now);
  const decision = decideAutoActivation(state, window, now);

  return {
    now: now.toISOString(),
    connection: state.connection,
    settings: state.settings,
    scheduler: {
      enabled: state.scheduler.enabled,
      lastRunAt: state.scheduler.lastRunAt,
    },
    window,
    activations: state.activations.slice(0, 12),
    autoStatus: {
      active: decision.shouldActivate,
      reason: decision.reason,
    },
  };
}
