import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/domain/snapshot";
import { store } from "@/lib/store/file-store";
import type { HourRange, Settings } from "@/lib/store/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const state = await store.read();
  return NextResponse.json({ settings: state.settings });
}

function clampHour(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(23, Math.max(0, Math.round(n)));
}

function sanitizeRange(input: unknown, fallback: HourRange): HourRange {
  const r = (input ?? {}) as Partial<HourRange>;
  return {
    start: clampHour(r.start, fallback.start),
    end: clampHour(r.end, fallback.end),
  };
}

/** Update settings. Values are validated and clamped to safe ranges. */
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<Settings>;
  const current = (await store.read()).settings;
  const patch: Partial<Settings> = {};

  if (body.windowHours !== undefined) {
    const n = Number(body.windowHours);
    if (Number.isFinite(n)) patch.windowHours = Math.min(24, Math.max(1, n));
  }
  if (typeof body.autoActivation === "boolean") {
    patch.autoActivation = body.autoActivation;
  }
  if (typeof body.activationMessage === "string") {
    patch.activationMessage = body.activationMessage.slice(0, 280);
  }
  if (typeof body.model === "string") patch.model = body.model.slice(0, 40);
  if (body.activationDelayMinutes !== undefined) {
    const n = Number(body.activationDelayMinutes);
    if (Number.isFinite(n))
      patch.activationDelayMinutes = Math.min(120, Math.max(0, Math.round(n)));
  }
  if (typeof body.timeZone === "string") patch.timeZone = body.timeZone.slice(0, 60);
  if (body.workingHours) {
    patch.workingHours = sanitizeRange(body.workingHours, current.workingHours);
  }
  if (body.sleepHours) {
    patch.sleepHours = sanitizeRange(body.sleepHours, current.sleepHours);
  }

  const settings = await store.updateSettings(patch);
  // Keep the scheduler flag aligned with the automation toggle.
  if (typeof body.autoActivation === "boolean") {
    await store.setScheduler({ enabled: body.autoActivation });
  }
  return NextResponse.json({ ok: true, settings, snapshot: await getSnapshot() });
}
