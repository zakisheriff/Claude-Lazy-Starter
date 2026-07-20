import { NextResponse } from "next/server";
import { store } from "@/lib/store/file-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Uploads or clears the captured Claude session. This carries your login, so it
 * is guarded by ADMIN_TOKEN and never returns the session back to the browser.
 * Set ADMIN_TOKEN in the environment and send it as a Bearer token.
 */
function authorized(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token.length > 0 && token === expected;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Set ADMIN_TOKEN and send it as a Bearer token." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    storageState?: unknown;
  };

  // Accept either a JSON string or an already parsed object.
  let serialized: string;
  try {
    serialized =
      typeof body.storageState === "string"
        ? JSON.stringify(JSON.parse(body.storageState))
        : JSON.stringify(body.storageState);
  } catch {
    return NextResponse.json(
      { ok: false, error: "storageState must be valid Playwright storage state JSON." },
      { status: 400 },
    );
  }

  if (!serialized || serialized === "null" || serialized === "{}") {
    return NextResponse.json(
      { ok: false, error: "storageState is empty." },
      { status: 400 },
    );
  }

  await store.setSession({
    storageState: serialized,
    capturedAt: new Date().toISOString(),
  });
  await store.setConnection({ lastError: null });

  return NextResponse.json({
    ok: true,
    detail: "Session saved. Open the dashboard and press Connect to verify it.",
  });
}

export async function DELETE(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  await store.setSession({ storageState: null, capturedAt: null });
  await store.setConnection({
    connected: false,
    account: null,
    connectedAt: null,
    lastError: null,
  });
  return NextResponse.json({ ok: true, detail: "Session cleared." });
}
