import { activationId } from "@/lib/domain/activation";
import { computeWindow } from "@/lib/domain/window";
import { store } from "@/lib/store/file-store";
import type { ActivationRecord, Trigger } from "@/lib/store/types";
import { getDriver } from "./index";

/**
 * Orchestrates a single activation: runs the driver, records the outcome, and
 * marks the window as started so it is never opened twice. Shared by the manual
 * "activate now" endpoint and the background scheduler.
 */
export async function runActivation(
  trigger: Trigger,
): Promise<ActivationRecord> {
  const state = await store.read();
  const view = computeWindow(state);
  const { settings } = state;
  const driver = getDriver();
  const now = new Date();

  const result = await driver.activate({
    message: settings.activationMessage,
    model: settings.model,
    trigger,
  });

  const record: ActivationRecord = {
    id: activationId(now),
    at: now.toISOString(),
    trigger,
    status: result.status,
    message: settings.activationMessage,
    model: settings.model,
    detail: result.detail,
    windowKey: view.windowKey,
  };

  await store.addActivation(record);

  if (result.status === "success") {
    await store.setScheduler({
      lastActivatedWindowKey: view.windowKey,
      lastRunAt: now.toISOString(),
    });
  } else {
    await store.setScheduler({ lastRunAt: now.toISOString() });
  }

  return record;
}
