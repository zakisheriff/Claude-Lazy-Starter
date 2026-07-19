import { NextResponse } from "next/server";
import { getDriver } from "@/lib/automation";
import { getSnapshot } from "@/lib/domain/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Connect or disconnect the automation session. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    action?: "connect" | "disconnect";
    account?: string;
  };
  const driver = getDriver();

  if (body.action === "disconnect") {
    await driver.disconnect();
    return NextResponse.json({ ok: true, snapshot: await getSnapshot() });
  }

  if (body.action === "connect") {
    const result = await driver.connect(body.account?.trim() || undefined);
    return NextResponse.json({
      ok: result.connected,
      detail: result.detail,
      snapshot: await getSnapshot(),
    });
  }

  return NextResponse.json(
    { ok: false, error: "Provide action as connect or disconnect." },
    { status: 400 },
  );
}
