"use client";

import { useState } from "react";

/**
 * A single command, set in mono on a quiet panel, with a copy button. Used by
 * the setup steps so a reader can paste each command straight into a terminal.
 */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable; the command stays selectable.
    }
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] border border-line bg-panel px-5 py-4">
      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[15px] text-ink">
        {code}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 cursor-pointer text-[14px] text-ink-soft transition-colors hover:text-ink"
        aria-label={`Copy ${code}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
