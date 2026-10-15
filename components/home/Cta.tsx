import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

export function Cta() {
  return (
    <section className="px-6 pt-16 pb-32 md:pt-24 md:pb-44">
      <Reveal className="mx-auto w-full max-w-[800px] border-t border-line-strong pt-20 text-center">
        <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-balance text-ink md:text-[56px]">
          Wake up to time already waiting
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] font-serif text-[19px] leading-relaxed text-ink-soft">
          A few minutes of setup, then it runs every hour on its own, free, in
          your own GitHub account.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#set-it-up" size="lg">
            Set it up
          </Button>
          <Button href="/#how-it-works" size="lg" variant="secondary">
            Watch how it works
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
