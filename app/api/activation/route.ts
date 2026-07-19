import { NextResponse } from "next/server";
import { runActivation } from "@/lib/automation/service";
import { getSnapshot } from "@/lib/domain/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Manually open a window now. Returns the record and a fresh snapshot. */
export async function POST() {
  const record = await runActivation("manual");
  const snapshot = await getSnapshot();
  const ok = record.status === "success";
  return NextResponse.json({ ok, record, snapshot }, { status: ok ? 200 : 409 });
}
