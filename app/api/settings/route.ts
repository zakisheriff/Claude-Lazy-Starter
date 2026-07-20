import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/domain/snapshot";
import { store } from "@/lib/store/file-store";
import type { Settings } from "@/lib/store/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const state = await store.read();
  return NextResponse.json({ settings: state.settings });
}

/** Update the small set of settings. Values are validated and clamped. */
export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<Settings>;
  const patch: Partial<Settings> = {};

  if (body.windowHours !== undefined) {
    const n = Number(body.windowHours);
    if (Number.isFinite(n)) patch.windowHours = Math.min(24, Math.max(1, n));
  }
  if (typeof body.autoActivation === "boolean") {
    patch.autoActivation = body.autoActivation;
  }
  if (typeof body.activationMessage === "string") {
    const trimmed = body.activationMessage.trim().slice(0, 280);
    if (trimmed) patch.activationMessage = trimmed;
  }

  const settings = await store.updateSettings(patch);
  if (typeof body.autoActivation === "boolean") {
    await store.setScheduler({ enabled: body.autoActivation });
  }
  return NextResponse.json({ ok: true, settings, snapshot: await getSnapshot() });
}
