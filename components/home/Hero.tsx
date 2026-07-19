import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import {
  TimelineLegend,
  WindowTimeline,
} from "@/components/ui/WindowTimeline";

/**
 * Landing hero. The thesis is the timeline itself: a day where the refreshed
 * window is started at eight in the morning while you sleep, so four hours move
 * back into your working day. The headline states the promise plainly.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 pt-28 pb-20 lg:px-8">
      <div className="mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-7xl">
            Stop losing Claude hours while you sleep
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-ink-soft md:text-xl">
            Your usage window only starts once you send a message. Claude Lazy
            Starter opens it the moment it refreshes, so the five hour clock runs
            through the early morning instead of the middle of your workday.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/dashboard" size="lg">
              Open dashboard
            </Button>
            <Button href="/settings" size="lg" variant="secondary">
              Set your hours
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal
        delay={0.15}
        className="mx-auto mt-16 w-full max-w-4xl rounded-[var(--radius-lg)] border border-line bg-paper-raised p-6 shadow-[var(--shadow-soft)] md:p-8"
      >
        <div className="mb-5 flex flex-col gap-1 text-left">
          <p className="text-[15px] font-medium text-ink">
            A window refreshing at 8:00 am
          </p>
          <p className="text-[14px] text-ink-soft">
            Started automatically at refresh, ending at 1:00 pm, ready before you
            sit down.
          </p>
        </div>
        <WindowTimeline
          segments={[
            { startHour: 0, endHour: 8, tone: "sleep" },
            { startHour: 8, endHour: 13, tone: "window" },
            { startHour: 8, endHour: 12, tone: "reclaimed" },
          ]}
          markers={[
            { hour: 8, label: "Refresh and auto start", strong: true },
            { hour: 12, label: "You wake up", strong: true },
          ]}
        />
        <TimelineLegend
          className="mt-6"
          items={[
            { tone: "sleep", label: "Asleep" },
            { tone: "reclaimed", label: "Hours reclaimed" },
            { tone: "window", label: "Active window" },
          ]}
        />
      </Reveal>
    </section>
  );
}
