import Reveal from "@/components/motion/Reveal";
import { sections } from "./sections";

/**
 * Landing hero. A night sky over a glowing horizon, which is the whole idea in
 * one picture: the window starts while the world is still dark. Below the
 * title, a numbered contents list leads into the article.
 */
export function Hero() {
  return (
    <section
      data-hero
      className="grain relative flex min-h-[112svh] flex-col items-center overflow-hidden bg-night text-on-night"
    >
      {/* Sky, from deep night at the top through blue and lilac to the warm
          band just above the horizon. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0b1020 0%, #16264a 14%, #3a5b93 30%, #6d86b9 40%, #9a8fb8 47%, #d08a6c 53%, #ec7a3c 57%, #2a1610 63%, #120c0a 100%)",
        }}
      />
      {/* The curve of the planet. Its top edge catches the light. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[57%] aspect-square w-[340vw] -translate-x-1/2 rounded-[50%] bg-[#120c0a] shadow-[0_-18px_70px_rgba(236,122,60,0.75),0_-3px_10px_rgba(255,190,140,0.9)] sm:w-[260vw]"
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pt-[26vh] sm:pt-[32vh] text-center">
        <Reveal>
          <p className="text-[13px] font-medium tracking-[0.14em] text-[#f2ede4] uppercase sm:text-[15px]">
            For Claude Pro and Max
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-8 font-serif text-[clamp(52px,9vw,124px)] leading-[0.95] font-medium tracking-[-0.025em] text-[#f2ede4]">
            Claude Lazy Starter
          </h1>
        </Reveal>

        <Reveal delay={0.12} className="mt-[22vh] w-full max-w-[460px] sm:mt-[13vh]">
          <ol className="flex flex-col gap-2.5">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline font-serif text-[17px] text-[#f2ede4] transition-opacity hover:opacity-70"
                >
                  <span className="font-mono text-[13px]">({i + 1})</span>
                  <span className="leader" aria-hidden />
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
