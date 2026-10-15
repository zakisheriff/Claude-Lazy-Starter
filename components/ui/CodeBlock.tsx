"use client";

import { useState } from "react";

/**
 * Code set in mono on a quiet panel, with a copy button. A single command sits
 * on one line; a file (when `filename` is given) shows its path above a
 * scrollable body so a reader can paste it straight into place.
 */
export function CodeBlock({
  code,
  filename,
  copyLabel = "Copy",
  wrap = false,
}: {
  code: string;
  filename?: string;
  copyLabel?: string;
  /** Wrap long lines instead of scrolling sideways, for prose like prompts. */
  wrap?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable; the code stays selectable.
    }
  }

  const button = (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 cursor-pointer text-[14px] text-ink-soft transition-colors hover:text-ink"
      aria-label={filename ? `Copy ${filename}` : `Copy ${code}`}
    >
      {copied ? "Copied" : copyLabel}
    </button>
  );

  if (filename) {
    return (
      <div className="mt-5 overflow-hidden rounded-[var(--radius-sm)] border border-line bg-panel">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <span className="min-w-0 truncate text-[14px] text-ink-soft">
            {filename}
          </span>
          {button}
        </div>
        <pre
          className={`max-h-[420px] overflow-auto px-5 py-4 font-mono text-[13px] leading-relaxed text-ink ${
            wrap ? "break-words whitespace-pre-wrap" : ""
          }`}
        >
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-[var(--radius-sm)] border border-line bg-panel px-5 py-4">
      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-[15px] text-ink">
        {code}
      </code>
      {button}
    </div>
  );
}
