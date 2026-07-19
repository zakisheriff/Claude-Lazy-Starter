/**
 * The automation boundary. Everything that opens a Claude session goes through
 * this interface, so the current simulated driver and a future Playwright
 * driver are interchangeable. No part of the app depends on how a session is
 * actually opened.
 */

export interface ActivateOptions {
  message: string;
  model: string;
  trigger: "auto" | "manual";
}

export interface ActivationResult {
  status: "success" | "failed";
  /** Human readable outcome, surfaced in the history list. */
  detail: string;
  /** Set when the session was reported as expired, so the UI can prompt a reconnect. */
  sessionExpired?: boolean;
}

export interface ConnectResult {
  connected: boolean;
  account: string | null;
  detail: string;
}

export interface ActivationDriver {
  /** A stable name for logs and diagnostics. */
  readonly name: string;
  connect(account?: string): Promise<ConnectResult>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  activate(options: ActivateOptions): Promise<ActivationResult>;
}
