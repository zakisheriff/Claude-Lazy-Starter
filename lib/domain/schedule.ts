import type { HourRange } from "@/lib/store/types";

/**
 * Hour-range helpers. A range covers whole hours from start up to, but not
 * including, end. When end is less than or equal to start the range wraps past
 * midnight, for example sleep from 23 to 7.
 */

export function isHourInRange(hour: number, range: HourRange): boolean {
  const h = ((hour % 24) + 24) % 24;
  const { start, end } = range;
  if (start === end) return false;
  if (start < end) return h >= start && h < end;
  // Wrapping range.
  return h >= start || h < end;
}

export function isWithinRange(date: Date, range: HourRange): boolean {
  return isHourInRange(date.getHours(), range);
}

/** Whole-hour length of a range, accounting for wrap. */
export function rangeLength(range: HourRange): number {
  const { start, end } = range;
  if (start === end) return 0;
  return start < end ? end - start : 24 - start + end;
}

/** Fraction of the day a range covers, 0 to 1, for timeline rendering. */
export function rangeCoverage(range: HourRange): number {
  return rangeLength(range) / 24;
}
