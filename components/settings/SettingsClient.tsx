"use client";

import { useState } from "react";
import type { Settings } from "@/lib/store/types";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-sm">
      <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-ink">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        {description}
      </p>
    </div>
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
      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Automatic activation"
          description="When on, a fresh window is started the moment the last one ends, so there is always time waiting for you."
        />
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="auto" className="text-[15px] font-medium text-ink">
            Keep a window always running
          </label>
          <Toggle
            id="auto"
            checked={settings.autoActivation}
            onChange={(v) => update("autoActivation", v)}
            label="Keep a window always running"
          />
        </div>
      </Panel>

      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Activation message"
          description="The short message sent to open a window. A plain hi is all it takes."
        />
        <Field label="Message" htmlFor="message">
          <Input
            id="message"
            type="text"
            value={settings.activationMessage}
            maxLength={280}
            onChange={(e) => update("activationMessage", e.target.value)}
          />
        </Field>
      </Panel>

      <Panel className="grid gap-8 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
        <SectionHeading
          title="Window length"
          description="How long a usage window lasts once it opens. Claude's window is five hours."
        />
        <Field label="Hours" htmlFor="window">
          <Input
            id="window"
            type="number"
            min={1}
            max={24}
            value={settings.windowHours}
            onChange={(e) => update("windowHours", Number(e.target.value))}
          />
        </Field>
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
