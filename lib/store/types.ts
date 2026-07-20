/**
 * Persisted application state. This is a single tenant, personal productivity
 * tool, so all state lives under one document. Times are stored as ISO strings
 * and hour-of-day values as integers in local 24 hour form.
 */

export type Trigger = "auto" | "manual";

export type ActivationStatus = "success" | "failed" | "skipped";

export interface ActivationRecord {
  id: string;
  /** When the activation attempt ran. */
  at: string;
  trigger: Trigger;
  status: ActivationStatus;
  /** The activation message that was sent. */
  message: string;
  /** The model the session was started on. */
  model: string;
  /** Human readable outcome detail, shown in the history list. */
  detail: string;
  /** Window key this activation opened, used for idempotency. */
  windowKey?: string;
}

export interface Settings {
  /** Length of a usage window in hours. */
  windowHours: number;
  /** Whether a fresh window is started automatically the moment one is free. */
  autoActivation: boolean;
  /** The short message sent to open a fresh window. */
  activationMessage: string;
}

export interface ConnectionState {
  connected: boolean;
  /** A friendly label for the connected account. */
  account: string | null;
  connectedAt: string | null;
  /** Present when the last session check failed or expired. */
  lastError: string | null;
}

export interface SchedulerState {
  enabled: boolean;
  lastRunAt: string | null;
  /** Window key most recently activated, prevents double activation. */
  lastActivatedWindowKey: string | null;
}

/**
 * The captured Claude web session. `storageState` is the Playwright storage
 * state JSON (cookies and local storage) produced by the one time login. It is
 * what lets the always on server open claude.ai as you. Kept out of API GET
 * responses so it is never sent to the browser.
 */
export interface SessionState {
  storageState: string | null;
  capturedAt: string | null;
}

export interface AppState {
  settings: Settings;
  connection: ConnectionState;
  scheduler: SchedulerState;
  session: SessionState;
  activations: ActivationRecord[];
}
