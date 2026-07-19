"use client";

import { useState } from "react";
import type { Settings } from "@/lib/store/types";
import { formatHour } from "@/lib/time/format";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";

const MODELS = ["Sonnet 5", "Opus 4.8", "Haiku 4.5", "Fable 5"];
const HOURS = Array.from({ length: 24 }, (_, h) => h);

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-sm">
      <h2 className="text-2xl font-medium tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        {description}
      </p>
    </div>
  );
}

function HourSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Select
      id={id}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {HOURS.map((h) => (
        <option key={h} value={h}>
          {formatHour(h)}
        </option>
      ))}
    </Select>
  );
}

export function SettingsClient({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 lg:px-8">
      {/* Automatic activation */}
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Automatic activation"
          description="Let the scheduler open a window during your sleep hours so the clock starts before you wake."
        />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="auto" className="text-[15px] font-medium text-ink">
              Activate windows automatically
            </label>
            <Toggle
              id="auto"
              checked={settings.autoActivation}
              onChange={(v) => update("autoActivation", v)}
              label="Activate windows automatically"
            />
          </div>
          <Field
            label="Wait before activating"
            htmlFor="delay"
            description="Minutes to wait after a window becomes available before starting it."
          >
            <Input
              id="delay"
              type="number"
              min={0}
              max={120}
              value={settings.activationDelayMinutes}
              onChange={(e) =>
                update("activationDelayMinutes", Number(e.target.value))
              }
            />
          </Field>
        </div>
      </Panel>

      {/* Activation behavior */}
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Activation behavior"
          description="What the automation sends to open a session. Keep the message short; it only needs to start the window."
        />
        <div className="flex flex-col gap-6">
          <Field
            label="Activation message"
            htmlFor="message"
            description="Sent as the first message of the new session."
          >
            <Textarea
              id="message"
              value={settings.activationMessage}
              maxLength={280}
              onChange={(e) => update("activationMessage", e.target.value)}
            />
          </Field>
          <Field label="Model" htmlFor="model">
            <Select
              id="model"
              value={settings.model}
              onChange={(e) => update("model", e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Panel>

      {/* Session settings */}
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Session settings"
          description="How long a window lasts and the time zone your hours are measured in."
        />
        <div className="flex flex-col gap-6">
          <Field
            label="Window length in hours"
            htmlFor="window"
            description="The length of a usage window once it opens."
          >
            <Input
              id="window"
              type="number"
              min={1}
              max={24}
              value={settings.windowHours}
              onChange={(e) => update("windowHours", Number(e.target.value))}
            />
          </Field>
          <Field label="Time zone label" htmlFor="tz">
            <Input
              id="tz"
              type="text"
              value={settings.timeZone}
              onChange={(e) => update("timeZone", e.target.value)}
            />
          </Field>
        </div>
      </Panel>

      {/* Working hours */}
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Working hours"
          description="The hours you are usually at your desk. Automatic activation leaves these windows for you to start."
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start" htmlFor="work-start">
            <HourSelect
              id="work-start"
              value={settings.workingHours.start}
              onChange={(v) =>
                update("workingHours", { ...settings.workingHours, start: v })
              }
            />
          </Field>
          <Field label="End" htmlFor="work-end">
            <HourSelect
              id="work-end"
              value={settings.workingHours.end}
              onChange={(v) =>
                update("workingHours", { ...settings.workingHours, end: v })
              }
            />
          </Field>
        </div>
      </Panel>

      {/* Sleep hours */}
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Sleep hours"
          description="When you are usually asleep. This is when the automation prefers to start a fresh window."
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start" htmlFor="sleep-start">
            <HourSelect
              id="sleep-start"
              value={settings.sleepHours.start}
              onChange={(v) =>
                update("sleepHours", { ...settings.sleepHours, start: v })
              }
            />
          </Field>
          <Field label="End" htmlFor="sleep-end">
            <HourSelect
              id="sleep-end"
              value={settings.sleepHours.end}
              onChange={(v) =>
                update("sleepHours", { ...settings.sleepHours, end: v })
              }
            />
          </Field>
        </div>
      </Panel>

      <div className="sticky bottom-6 z-10 mt-2 flex items-center justify-end gap-4 rounded-full border border-line bg-paper-raised/90 px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
        {saved ? (
          <span className="text-[14px] text-ink-soft">Settings saved</span>
        ) : null}
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
