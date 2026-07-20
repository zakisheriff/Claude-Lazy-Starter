import { cn } from "@/lib/utils/cn";

/**
 * The signature element. A single day drawn as a 24 hour band, with coloured
 * segments for sleep, the usage window, and the time reclaimed from sleeping
 * hours, plus labelled markers for the moments that matter. Pure and
 * presentational, so it renders on the server and is reused on the landing
 * page and the dashboard.
 */

export type Tone =
  | "sleep"
  | "window"
  | "reclaimed"
  | "work"
  | "wasted"
  | "faint";

export interface Segment {
  startHour: number;
  endHour: number;
  tone: Tone;
  label?: string;
}

export interface Marker {
  hour: number;
  label: string;
  strong?: boolean;
}

const toneClass: Record<Tone, string> = {
  sleep: "bg-panel-strong",
  window: "bg-clay",
  reclaimed:
    "bg-[repeating-linear-gradient(135deg,var(--clay)_0,var(--clay)_6px,color-mix(in_srgb,var(--clay)_70%,white)_6px,color-mix(in_srgb,var(--clay)_70%,white)_12px)]",
  work: "bg-[color-mix(in_srgb,var(--clay)_22%,transparent)]",
  wasted:
    "bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--ink)_12%,var(--panel))_0,color-mix(in_srgb,var(--ink)_12%,var(--panel))_6px,var(--panel)_6px,var(--panel)_12px)]",
  faint: "bg-panel",
};

function pct(hour: number): number {
  return (Math.max(0, Math.min(24, hour)) / 24) * 100;
}

/** Split segments that wrap past midnight so they render in one row. */
function normalize(segments: Segment[]): Segment[] {
  const out: Segment[] = [];
  for (const s of segments) {
    if (s.endHour <= s.startHour) {
      out.push({ ...s, endHour: 24 });
      out.push({ ...s, startHour: 0, endHour: s.endHour, label: undefined });
    } else {
      out.push(s);
    }
  }
  return out;
}

export function WindowTimeline({
  segments,
  markers = [],
  hourLabels = [0, 6, 12, 18, 24],
  className,
}: {
  segments: Segment[];
  markers?: Marker[];
  hourLabels?: number[];
  className?: string;
}) {
  const resolved = normalize(segments);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-16 w-full overflow-hidden rounded-[var(--radius-sm)] border border-line bg-panel">
        {resolved.map((s, i) => (
          <div
            key={i}
            className={cn("absolute top-0 h-full", toneClass[s.tone])}
            style={{
              left: `${pct(s.startHour)}%`,
              width: `${pct(s.endHour) - pct(s.startHour)}%`,
            }}
            aria-hidden
          />
        ))}
        {markers.map((m, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{ left: `${pct(m.hour)}%` }}
            aria-hidden
          >
            <span
              className={cn(
                "absolute top-0 h-full w-px",
                m.strong ? "bg-ink" : "bg-ink/35",
              )}
            />
          </div>
        ))}
      </div>

      {/* Marker labels sit centred directly under their line. When two markers
          are close, the later one drops to a second row so the labels never
          overlap while each stays under the moment it names. */}
      {markers.length > 0 ? (
        (() => {
          const MIN_GAP = 18; // percent of width before labels would collide
          let prevPct = -Infinity;
          let prevRow = -1;
          const rows = markers.map((m) => {
            const p = pct(m.hour);
            const row = p - prevPct < MIN_GAP && prevRow === 0 ? 1 : 0;
            prevPct = p;
            prevRow = row;
            return row;
          });
          const twoRows = rows.some((r) => r === 1);
          return (
            <div
              className="relative mt-3"
              style={{ height: twoRows ? 42 : 22 }}
            >
              {markers.map((m, i) => (
                <div
                  key={i}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${pct(m.hour)}%`, top: rows[i] * 20 }}
                >
                  <span
                    className={cn(
                      "block whitespace-nowrap text-center text-[12.5px] leading-tight",
                      m.strong ? "font-medium text-ink" : "text-ink-soft",
                    )}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          );
        })()
      ) : null}

      <div className="mt-3 flex justify-between text-[12px] tabular-nums text-ink-soft">
        {hourLabels.map((h) => (
          <span key={h}>{h === 24 ? "12 am" : h === 0 ? "12 am" : h === 12 ? "12 pm" : h < 12 ? `${h} am` : `${h - 12} pm`}</span>
        ))}
      </div>
    </div>
  );
}

/** Small legend describing what the timeline colours mean. */
export function TimelineLegend({
  items,
  className,
}: {
  items: { tone: Tone; label: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2", className)}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-[13px] text-ink-soft">
          <span className={cn("h-3 w-3 rounded-[3px]", toneClass[it.tone])} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
