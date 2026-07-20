"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardSnapshot } from "@/lib/domain/snapshot";
import {
  formatClock,
  formatCountdown,
  formatDateTime,
  formatDuration,
} from "@/lib/time/format";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { StatusPill } from "@/components/ui/StatusPill";
import { Toggle } from "@/components/ui/Toggle";
import {
  type Segment,
  TimelineLegend,
  WindowTimeline,
} from "@/components/ui/WindowTimeline";

function hourFloat(iso: string): number {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60;
}

/** Build today's 24 hour band from the live snapshot. */
function buildSegments(snapshot: DashboardSnapshot): {
  segments: Segment[];
  markers: { hour: number; label: string; strong?: boolean }[];
} {
  const { window } = snapshot;
  // A quiet full day base, with the active window laid over it.
  const segments: Segment[] = [{ startHour: 0, endHour: 24, tone: "faint" }];
  const markers: { hour: number; label: string; strong?: boolean }[] = [];

  if (window.active && window.startedAt && window.endsAt) {
    const start = hourFloat(window.startedAt);
    const end = hourFloat(window.endsAt);
    segments.push({ startHour: start, endHour: end, tone: "window" });
    markers.push({ hour: start, label: "Started", strong: true });
    markers.push({ hour: end, label: "Ends", strong: true });
  }

  return { segments, markers };
}

export function DashboardClient({
  initial,
}: {
  initial: DashboardSnapshot;
}) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(initial);
  const [now, setNow] = useState<number>(() => Date.now());
  const [busy, setBusy] = useState<null | "activate" | "connect" | "auto">(null);
  const [notice, setNotice] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live clock for the countdown.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Refresh from the server periodically to reflect background activity.
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/scheduler", { cache: "no-store" });
      const data = await res.json();
      if (data.snapshot) setSnapshot(data.snapshot);
    } catch {
      // Ignore transient network errors; the next poll retries.
    }
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(refresh, 30000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  const post = useCallback(
    async (url: string, body?: unknown) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.json();
    },
    [],
  );

  const onActivate = async () => {
    setBusy("activate");
    setNotice(null);
    try {
      const data = await post("/api/activation");
      if (data.snapshot) setSnapshot(data.snapshot);
      setNotice(data.record?.detail ?? "Activation attempted.");
    } finally {
      setBusy(null);
    }
  };

  const onToggleAuto = async (next: boolean) => {
    setBusy("auto");
    try {
      const data = await post("/api/scheduler", { enabled: next });
      if (data.snapshot) setSnapshot(data.snapshot);
    } finally {
      setBusy(null);
    }
  };

  const onConnection = async (action: "connect" | "disconnect") => {
    setBusy("connect");
    setNotice(null);
    try {
      const data = await post("/api/connection", { action });
      if (data.snapshot) setSnapshot(data.snapshot);
      if (data.detail) setNotice(data.detail);
    } finally {
      setBusy(null);
    }
  };

  const { window, connection, settings, autoStatus } = snapshot;
  const remainingMs = window.active && window.endsAt
    ? new Date(window.endsAt).getTime() - now
    : 0;
  const { segments, markers } = buildSegments(snapshot);

  const windowTone = window.active ? "positive" : window.availableNow ? "clay" : "neutral";
  const windowLabel = window.active
    ? "Window active"
    : window.availableNow
      ? "Window available"
      : "No window";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
      {/* Connection state and reconnect prompt. */}
      {!connection.connected ? (
        <Panel className="mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-medium text-ink">
              {connection.lastError
                ? "Your session needs reconnecting"
                : "Connect your account to begin"}
            </p>
            <p className="mt-1 text-[14px] text-ink-soft">
              {connection.lastError ??
                "Automation opens windows using your own connected session."}
            </p>
          </div>
          <Button
            onClick={() => onConnection("connect")}
            disabled={busy === "connect"}
          >
            {busy === "connect" ? "Connecting" : "Connect account"}
          </Button>
        </Panel>
      ) : null}

      {/* Primary readout. */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel raised className="flex flex-col justify-between gap-8 p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusPill tone={windowTone}>{windowLabel}</StatusPill>
              <h2 className="mt-5 text-5xl font-semibold tracking-tight tabular-nums text-ink md:text-6xl">
                {window.active ? formatCountdown(remainingMs) : "Ready"}
              </h2>
              <p className="mt-2 text-[15px] text-ink-soft">
                {window.active && window.endsAt
                  ? `Remaining, ending at ${formatClock(window.endsAt)}`
                  : window.availableNow
                    ? "A fresh window is available to start now"
                    : "Waiting for the next window"}
              </p>
            </div>
          </div>

          <div>
            {window.active ? (
              <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-panel-strong">
                <div
                  className="h-full rounded-full bg-clay transition-[width] duration-1000"
                  style={{ width: `${Math.round(window.progress * 100)}%` }}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={onActivate}
                disabled={busy === "activate" || !connection.connected}
                size="lg"
              >
                {busy === "activate" ? "Starting a window" : "Activate now"}
              </Button>
              {connection.connected ? (
                <Button
                  variant="ghost"
                  onClick={() => onConnection("disconnect")}
                  disabled={busy === "connect"}
                >
                  Disconnect
                </Button>
              ) : null}
            </div>
            {notice ? (
              <p className="mt-4 text-[14px] text-ink-soft">{notice}</p>
            ) : null}
          </div>
        </Panel>

        <Panel className="flex flex-col gap-6 p-7 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-medium text-ink">
                Automatic activation
              </p>
              <p className="mt-1 max-w-xs text-[14px] leading-relaxed text-ink-soft">
                {autoStatus.reason}
              </p>
            </div>
            <Toggle
              checked={settings.autoActivation}
              onChange={onToggleAuto}
              disabled={busy === "auto"}
              label="Automatic activation"
            />
          </div>
          <div className="h-px w-full bg-line" />
          <div className="grid grid-cols-2 gap-6">
            <Stat
              value={formatClock(window.nextAvailableAt)}
              label={window.active ? "Next refresh" : "Available since"}
            />
            <Stat
              value={window.active ? formatCountdown(remainingMs) : "0m"}
              label="Estimated remaining"
              tone="clay"
            />
          </div>
          <div className="h-px w-full bg-line" />
          <div className="flex items-center gap-3">
            <StatusPill tone={connection.connected ? "positive" : "warning"}>
              {connection.connected ? "Account connected" : "Not connected"}
            </StatusPill>
            {connection.account ? (
              <span className="text-[14px] text-ink-soft">
                {connection.account}
              </span>
            ) : null}
          </div>
        </Panel>
      </div>

      {/* Daily usage timeline. */}
      <Panel className="mt-6 p-7 md:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-ink">
              Today at a glance
            </h2>
            <p className="mt-1 text-[14px] text-ink-soft">
              Your day, with the active window laid over it.
            </p>
          </div>
          <TimelineLegend
            items={[
              { tone: "window", label: "Active window" },
              { tone: "faint", label: "Rest of the day" },
            ]}
          />
        </div>
        <WindowTimeline segments={segments} markers={markers} />
      </Panel>

      {/* Schedule and history. */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel className="flex flex-col gap-6 p-7 md:p-8">
          <h2 className="text-2xl font-medium tracking-tight text-ink">
            How it runs
          </h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[14px] text-ink-soft">Window length</p>
              <p className="mt-1 text-[17px] text-ink">
                {formatDuration(settings.windowHours * 3600000)}
              </p>
            </div>
            <div>
              <p className="text-[14px] text-ink-soft">Activation message</p>
              <p className="mt-1 text-[17px] text-ink">
                {settings.activationMessage}
              </p>
            </div>
            <p className="text-[14px] leading-relaxed text-ink-soft">
              The moment a window ends, a fresh one starts automatically. So
              whenever you sit down, this window still has time left and a full
              one follows it.
            </p>
          </div>
          <Button href="/settings" variant="secondary" className="mt-2 self-start">
            Change settings
          </Button>
        </Panel>

        <Panel className="flex flex-col p-7 md:p-8">
          <h2 className="text-2xl font-medium tracking-tight text-ink">
            Activation history
          </h2>
          {snapshot.activations.length === 0 ? (
            <p className="mt-6 text-[15px] text-ink-soft">
              No activations yet. Start your first window with Activate now, or
              let automatic activation open one overnight.
            </p>
          ) : (
            <ul className="mt-6 flex flex-col divide-y divide-line">
              {snapshot.activations.map((record) => {
                const tone =
                  record.status === "success"
                    ? "positive"
                    : record.status === "failed"
                      ? "danger"
                      : "neutral";
                return (
                  <li
                    key={record.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] text-ink">
                        {formatDateTime(record.at)}
                      </p>
                      <p className="mt-0.5 truncate text-[14px] text-ink-soft">
                        {record.detail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-ink-soft">
                        {record.trigger === "auto" ? "Automatic" : "Manual"}
                      </span>
                      <StatusPill tone={tone}>{record.status}</StatusPill>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
