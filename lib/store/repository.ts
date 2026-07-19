import type {
  ActivationRecord,
  AppState,
  ConnectionState,
  SchedulerState,
  Settings,
} from "./types";

/**
 * Persistence boundary. Everything above this interface is storage agnostic,
 * so the file-backed store below can be swapped for Postgres or SQLite in a
 * real deployment without touching the domain or the UI.
 */
export interface Repository {
  read(): Promise<AppState>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;
  setConnection(patch: Partial<ConnectionState>): Promise<ConnectionState>;
  setScheduler(patch: Partial<SchedulerState>): Promise<SchedulerState>;
  addActivation(record: ActivationRecord): Promise<ActivationRecord>;
  /** Newest first, capped at limit. */
  listActivations(limit?: number): Promise<ActivationRecord[]>;
}
