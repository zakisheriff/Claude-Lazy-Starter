import { cn } from "@/lib/utils/cn";

type Tone = "positive" | "warning" | "danger" | "neutral" | "clay";

const tones: Record<Tone, string> = {
  positive:
    "text-positive bg-[color-mix(in_srgb,var(--positive)_12%,transparent)]",
  warning:
    "text-warning bg-[color-mix(in_srgb,var(--warning)_14%,transparent)]",
  danger: "text-danger bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]",
  neutral: "text-ink-soft bg-panel",
  clay: "text-clay bg-clay-wash",
};

/**
 * A small state label with a soft dot. The dot here carries meaning, it marks
 * live status, and is not decoration before text.
 */
export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium",
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
      />
      {children}
    </span>
  );
}
