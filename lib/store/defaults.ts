import type { AppState, Settings } from "./types";

export const defaultSettings: Settings = {
  windowHours: 5,
  autoActivation: true,
  activationMessage: "Good morning. Starting the session for the day.",
  model: "Sonnet 5",
  activationDelayMinutes: 2,
  workingHours: { start: 9, end: 18 },
  sleepHours: { start: 0, end: 8 },
  timeZone: "local",
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
    activations: [],
  };
}
