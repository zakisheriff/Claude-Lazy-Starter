import Reveal from "@/components/motion/Reveal";
import {
  TimelineLegend,
  WindowTimeline,
} from "@/components/ui/WindowTimeline";
import { Panel } from "@/components/ui/Panel";

/**
 * The problem, shown as a direct before and after. The same refresh time, two
 * outcomes: a morning lost to an unstarted window, or a morning reclaimed.
 */
export function Problem() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-24 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            The window refreshes at eight. You do not sit down until noon.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Nothing starts a window except your first message. So the four hours
            between refresh and your first coffee simply disappear, and the clock
            you do get runs deep into the afternoon.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal
            as="div"
            className="h-full"
          >
            <Panel className="flex h-full flex-col p-6 md:p-8">
              <p className="text-[15px] font-medium text-ink">
                Without Lazy Starter
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                The window sits idle until you start it at noon.
              </p>
              <div className="mt-8">
                <WindowTimeline
                  segments={[
                    { startHour: 0, endHour: 8, tone: "sleep" },
                    { startHour: 8, endHour: 12, tone: "faint" },
                    { startHour: 12, endHour: 17, tone: "window" },
                  ]}
                  markers={[
                    { hour: 8, label: "Refreshes", strong: true },
                    { hour: 12, label: "You start", strong: true },
                  ]}
                />
                <TimelineLegend
                  className="mt-6"
                  items={[
                    { tone: "sleep", label: "Asleep" },
                    { tone: "faint", label: "Idle and wasted" },
                    { tone: "window", label: "Active window" },
                  ]}
                />
              </div>
            </Panel>
          </Reveal>

          <Reveal as="div" delay={0.08} className="h-full">
            <Panel raised className="flex h-full flex-col p-6 md:p-8">
              <p className="text-[15px] font-medium text-ink">
                With Lazy Starter
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">
                The window starts at refresh, so the morning is yours to keep.
              </p>
              <div className="mt-8">
                <WindowTimeline
                  segments={[
                    { startHour: 0, endHour: 8, tone: "sleep" },
                    { startHour: 8, endHour: 13, tone: "window" },
                    { startHour: 8, endHour: 12, tone: "reclaimed" },
                  ]}
                  markers={[
                    { hour: 8, label: "Auto start", strong: true },
                    { hour: 12, label: "You wake up", strong: true },
                  ]}
                />
                <TimelineLegend
                  className="mt-6"
                  items={[
                    { tone: "sleep", label: "Asleep" },
                    { tone: "reclaimed", label: "Reclaimed" },
                    { tone: "window", label: "Active window" },
                  ]}
                />
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
