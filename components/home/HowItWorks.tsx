import Reveal from "@/components/motion/Reveal";

/**
 * How it works, as an ordered sequence. The numbering is meaningful here: these
 * steps happen in order, once, when you set the tool up.
 */
const steps = [
  {
    n: "1",
    title: "Connect your account",
    body: "Link your own Claude web account once. The session stays on your machine and is used only to open a window, never to read or move your work.",
  },
  {
    n: "2",
    title: "Set your hours",
    body: "Tell it when you sleep and when you work. Automatic activation only opens a window during your sleeping hours, so it never eats into a session you would have started yourself.",
  },
  {
    n: "3",
    title: "Wake up to a running window",
    body: "When usage refreshes overnight, it sends a short message to start the window. By the time you sit down, the clock is already running in your favour.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-panel px-6 py-24 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Set it once, then leave it alone
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.06} className="flex flex-col">
              <span className="text-[15px] font-medium tabular-nums text-clay">
                {step.n}
              </span>
              <div className="mt-4 h-px w-full bg-line-strong" />
              <h3 className="mt-6 text-2xl font-medium tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
