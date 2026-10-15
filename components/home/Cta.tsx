import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/seo/site";

export function Cta() {
  return (
    <section className="px-6 pt-16 pb-32 md:pt-24 md:pb-44">
      <Reveal className="mx-auto w-full max-w-[800px] border-t border-line-strong pt-20 text-center">
        <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-balance text-ink md:text-[56px]">
          Wake up to time already waiting
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] font-serif text-[19px] leading-relaxed text-ink-soft">
          Two minutes of setup, then it runs every hour on its own. Free and open
          source.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#set-it-up" size="lg">
            Set it up
          </Button>
          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center rounded-[var(--radius)] border border-line-strong px-6 text-[16px] text-ink transition-colors hover:bg-panel"
          >
            View the source
          </a>
        </div>
      </Reveal>
    </section>
  );
}
