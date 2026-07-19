import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function Cta() {
  return (
    <section className="flex min-h-screen flex-col justify-center bg-panel px-6 py-24 lg:px-8">
      <Reveal className="mx-auto w-full max-w-3xl text-center">
        <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
          Reclaim the morning you already paid for
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
          Connect your account, set your hours, and let the window start itself.
          The time you were losing to sleep becomes time you can actually use.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/dashboard" size="lg">
            Open dashboard
          </Button>
          <Button href="/settings" size="lg" variant="secondary">
            Configure activation
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
