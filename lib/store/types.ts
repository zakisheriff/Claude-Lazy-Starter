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

export interface HourRange {
  /** Hour of day the range starts, 0 to 23. */
  start: number;
  /** Hour of day the range ends, 0 to 23. May wrap past midnight. */
  end: number;
}

export interface Settings {
  /** Length of a usage window in hours. */
  windowHours: number;
  /** Whether the scheduler may activate windows on your behalf. */
  autoActivation: boolean;
  /** The message sent to open a fresh session. Keep it short. */
  activationMessage: string;
  /** Model the automated session starts on. */
  model: string;
  /** Only activate once the window has been available this many minutes. */
  activationDelayMinutes: number;
  /** Hours you are usually working. */
  workingHours: HourRange;
  /** Hours you are usually asleep. Activation is preferred here. */
  sleepHours: HourRange;
  /** IANA time zone label, shown for clarity. */
  timeZone: string;
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

export interface AppState {
  settings: Settings;
  connection: ConnectionState;
  scheduler: SchedulerState;
  activations: ActivationRecord[];
}
