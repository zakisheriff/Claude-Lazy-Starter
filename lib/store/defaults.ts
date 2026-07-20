import type { AppState, Settings } from "./types";

export const defaultSettings: Settings = {
  windowHours: 5,
  autoActivation: true,
  activationMessage: "Hi",
};

export function defaultState(): AppState {
  return {
    settings: { ...defaultSettings },
    connection: {
      connected: false,
      account: null,
      connectedAt: null,
      lastError: null,
    },
    scheduler: {
      enabled: true,
      lastRunAt: null,
      lastActivatedWindowKey: null,
    },
    session: {
      storageState: null,
      capturedAt: null,
    },
    activations: [],
  };
}
