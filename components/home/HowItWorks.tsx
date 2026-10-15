import Reveal from "@/components/motion/Reveal";
import {
  TimelineLegend,
  WindowTimeline,
} from "@/components/ui/WindowTimeline";
import { ArticleSection, Prose } from "./Article";
import { WorkflowFilm } from "./film/WorkflowFilm";

const comparison = [
  {
    label: "When the next window starts",
    note: "After your limit resets",
    without: "Whenever you send your first message",
    with: "Within an hour of the last one ending",
  },
  {
    label: "Waiting when you wake",
    note: "At 7:00 am",
    without: "Nothing running yet",
    with: "About an hour left on a running window",
  },
  {
    label: "Your next fresh window",
    note: "A full five hours",
    without: "Starts when you begin, ends at noon",
    with: "Opens at 8:07 am, right after the first",
  },
  {
    label: "Effort",
    note: "Each day",
    without: "Remember to start it",
    with: "None",
  },
] as const;

const night = [
  { time: "11:00 pm", what: "You hit your limit and go to sleep." },
  { time: "3:00 am", what: "Your window ends. Nothing is running." },
  {
    time: "3:07 am",
    what: "The hourly run sends Hi. A new window starts and runs until 8:07 am.",
  },
  { time: "7:00 am", what: "You wake up with an hour left on that window." },
  {
    time: "8:07 am",
    what: "That window ends. Your next message starts a full five hour window.",
  },
] as const;

const cell = "border border-line-strong px-4 py-4 align-top md:px-5";

export function HowItWorks() {
  return (
    <ArticleSection id="how-it-works" title="How it works">
      <Prose className="mt-10">
        <p>
          Take one ordinary night. You use up your window late in the evening,
          and it ends at 3:00 am while you sleep. On your own, the next window
          waits for you to start it. With Lazy Starter, it is already running
          by the time you wake up.
        </p>
      </Prose>

      <Reveal className="mx-auto mt-14 w-full max-w-[1104px]">
        <WorkflowFilm />
        <p className="mx-auto mt-4 max-w-[760px] text-center text-[15px] leading-relaxed text-ink-soft">
          One night with Lazy Starter, drawn in code. Drag the bar to scrub
          through the hours.
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-20 w-full max-w-[1104px]">
        <figure>
          <div className="grid border border-line-strong md:grid-cols-2">
            <div className="p-6 md:p-8">
              <p className="text-[16px] font-medium text-ink">On your own</p>
              <p className="mt-1 text-[15px] text-ink-soft">
                The window sits idle until you start it at 7:00 am.
              </p>
              <WindowTimeline
                className="mt-8"
                segments={[
                  { startHour: 23, endHour: 7, tone: "sleep" },
                  { startHour: 3, endHour: 7, tone: "wasted" },
                  { startHour: 7, endHour: 12, tone: "window" },
                ]}
                markers={[
                  { hour: 3, label: "Window ends", strong: true },
                  { hour: 7, label: "You start", strong: true },
                ]}
              />
            </div>
            <div className="border-t border-line-strong bg-clay-wash/45 p-6 md:border-t-0 md:border-l md:p-8">
              <p className="text-[16px] font-medium text-ink">
                With Lazy Starter
              </p>
              <p className="mt-1 text-[15px] text-ink-soft">
                A Hi at 3:07 am starts the window, and a fresh one follows at 8:07.
              </p>
              <WindowTimeline
                className="mt-8"
                segments={[
                  { startHour: 23, endHour: 7, tone: "sleep" },
                  { startHour: 3, endHour: 8, tone: "reclaimed" },
                  { startHour: 8, endHour: 13, tone: "window" },
                ]}
                markers={[
                  { hour: 3, label: "Hi sent", strong: true },
                  { hour: 8, label: "Fresh window", strong: true },
                ]}
              />
            </div>
          </div>
          <TimelineLegend
            className="mt-5 justify-center"
            items={[
              { tone: "sleep", label: "Asleep" },
              { tone: "wasted", label: "Idle and wasted" },
              { tone: "reclaimed", label: "Started for you" },
              { tone: "window", label: "A full window" },
            ]}
          />
          <figcaption className="mx-auto mt-4 max-w-[760px] text-center text-[15px] leading-relaxed text-ink-soft">
            Same night, same plan. Starting the window while you sleep moves
            your next fresh window four hours earlier into the day.
          </figcaption>
        </figure>
      </Reveal>

      <Reveal className="mx-auto mt-20 w-full max-w-[1104px] overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <thead>
            <tr>
              <th className={`${cell} w-[34%]`} />
              <th className={`${cell} font-medium text-ink`}>On your own</th>
              <th
                className={`${cell} bg-clay-wash font-medium text-ink shadow-[inset_2px_0_0_var(--clay),inset_-2px_0_0_var(--clay),inset_0_2px_0_var(--clay)]`}
              >
                With Lazy Starter
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, i) => (
              <tr key={row.label}>
                <td className={cell}>
                  <p className="font-medium text-ink">{row.label}</p>
                  <p className="mt-1 text-ink-soft">{row.note}</p>
                </td>
                <td className={`${cell} text-ink`}>{row.without}</td>
                <td
                  className={`${cell} bg-clay-wash font-medium text-ink ${
                    i === comparison.length - 1
                      ? "shadow-[inset_2px_0_0_var(--clay),inset_-2px_0_0_var(--clay),inset_0_-2px_0_var(--clay)]"
                      : "shadow-[inset_2px_0_0_var(--clay),inset_-2px_0_0_var(--clay)]"
                  }`}
                >
                  {row.with}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Prose className="mt-20">
        <p>
          <strong>A night, hour by hour.</strong> The workflow runs at seven
          minutes past every hour. If a window is already running, the Hi just
          uses a sliver of it and nothing resets. If your window has ended, it
          starts the next one.
        </p>
      </Prose>

      <Reveal className="mx-auto mt-10 w-full max-w-[800px]">
        <dl className="border-t border-line-strong">
          {night.map((row) => (
            <div
              key={row.time}
              className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-4 md:grid-cols-[120px_1fr]"
            >
              <dt className="font-mono text-[14px] text-ink-soft tabular-nums">
                {row.time}
              </dt>
              <dd className="font-serif text-[18px] leading-snug text-ink">
                {row.what}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </ArticleSection>
  );
}
