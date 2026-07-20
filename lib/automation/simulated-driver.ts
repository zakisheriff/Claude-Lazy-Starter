import { store } from "@/lib/store/file-store";
import type {
  ActivateOptions,
  ActivationDriver,
  ActivationResult,
  ConnectResult,
} from "./types";

/**
 * Simulated activation driver. It behaves like a real browser session without
 * touching claude.ai: it holds a connection flag, adds a little latency, and
 * occasionally reports the session as expired so the app can exercise its
 * reconnect handling. A real Playwright driver implementing ActivationDriver
 * can replace this without changing anything else.
 *
 * Diagnostics via environment:
 *   LAZY_SIM_LATENCY_MS   fixed latency to simulate (default random 400 to 1200)
 *   LAZY_SIM_OUTCOME      force "success" or "expired" on the next activation
 */
class SimulatedDriver implements ActivationDriver {
  readonly name = "simulated";

  private async latency(): Promise<void> {
    const fixed = Number(process.env.LAZY_SIM_LATENCY_MS);
    const ms = Number.isFinite(fixed) && fixed >= 0
      ? fixed
      : 400 + Math.floor(Math.random() * 800);
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connect(account = "Claude account"): Promise<ConnectResult> {
    await this.latency();
    const now = new Date().toISOString();
    await store.setConnection({
      connected: true,
      account,
      connectedAt: now,
      lastError: null,
    });
    return {
      connected: true,
      account,
      detail: "Session established and ready.",
    };
  }

  async disconnect(): Promise<void> {
    await store.setConnection({
      connected: false,
      account: null,
      connectedAt: null,
      lastError: null,
    });
  }

  async isConnected(): Promise<boolean> {
    const state = await store.read();
    return state.connection.connected;
  }

  async activate(options: ActivateOptions): Promise<ActivationResult> {
    await this.latency();

    if (!(await this.isConnected())) {
      return {
        status: "failed",
        detail: "No connected session. Connect your account and try again.",
        sessionExpired: true,
      };
    }

    const forced = process.env.LAZY_SIM_OUTCOME;
    const expired = forced === "expired" || (!forced && Math.random() < 0.08);

    if (expired) {
      await store.setConnection({
        connected: false,
        lastError: "The session expired. Reconnect to keep automation running.",
      });
      return {
        status: "failed",
        detail: "The session expired before the message could be sent.",
        sessionExpired: true,
      };
    }

    return {
      status: "success",
      detail: `Sent "${options.message}" and started a fresh window.`,
    };
  }
}

const globalForDriver = globalThis as unknown as {
  __lazyDriver?: SimulatedDriver;
};

export const simulatedDriver: ActivationDriver =
  globalForDriver.__lazyDriver ??
  (globalForDriver.__lazyDriver = new SimulatedDriver());
