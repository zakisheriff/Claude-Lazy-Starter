/**
 * Time and duration formatting. User-facing output avoids dash and hyphen
 * characters entirely, per the interface writing rules.
 */

export function formatClock(iso: string | number | Date): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDay(iso: string | number | Date): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string | number | Date): string {
  return `${formatDay(iso)} at ${formatClock(iso)}`;
}

/** Turn an hour of day into a readable clock label, for example 8 to 8:00 am. */
export function formatHour(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const ampm = normalized < 12 ? "am" : "pm";
  const twelve = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${twelve}:00 ${ampm}`;
}

/**
 * Format a positive duration in milliseconds as a spoken phrase, for example
 * "3 hours 40 minutes" or "12 minutes". Returns "none" for values at or below
 * zero so callers can render an empty window plainly.
 */
export function formatDuration(ms: number): string {
  if (ms <= 0) return "none";
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (parts.length === 0) return "under a minute";
  return parts.join(" ");
}

/** Compact countdown form used in live status, for example 3h 40m. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
