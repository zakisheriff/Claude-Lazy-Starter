import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/domain/snapshot";
import { store } from "@/lib/store/file-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getSnapshot();
  return NextResponse.json({ snapshot });
}

/** Turn automatic activation on or off. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    enabled?: boolean;
  };
  if (typeof body.enabled !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Provide enabled as a boolean." },
      { status: 400 },
    );
  }
  await store.setScheduler({ enabled: body.enabled });
  await store.updateSettings({ autoActivation: body.enabled });
  const snapshot = await getSnapshot();
  return NextResponse.json({ ok: true, snapshot });
}
