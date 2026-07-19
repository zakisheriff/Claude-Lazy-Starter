import { cn } from "@/lib/utils/cn";

/**
 * A single labelled figure. Used for the dashboard's primary readouts. The
 * label sits under the value so the number leads, which is what the reader
 * scans for first.
 */
export function Stat({
  value,
  label,
  tone = "ink",
  className,
}: {
  value: React.ReactNode;
  label: string;
  tone?: "ink" | "clay";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "text-3xl font-semibold tracking-tight tabular-nums md:text-4xl",
          tone === "clay" ? "text-clay" : "text-ink",
        )}
      >
        {value}
      </span>
      <span className="text-[14px] text-ink-soft">{label}</span>
    </div>
  );
}
