import { getImageProps } from "next/image";
import Reveal from "@/components/motion/Reveal";
import { sections } from "./sections";

/**
 * Landing hero: the atmospheric horizon artwork, which carries the title and
 * the plan line itself, with a numbered contents list in the dark below it.
 * Phones get a portrait cut of the same artwork through art direction, so each
 * device downloads only its own image. The heading stays in the markup for
 * search engines and screen readers.
 */
export function Hero() {
  const common = { alt: "", sizes: "100vw", priority: true, quality: 90 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/hero-horizon.jpg", width: 1672, height: 941 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/hero-horizon-mobile.jpg", width: 941, height: 1672 });

  return (
    <section
      data-hero
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0807] text-on-night sm:min-h-[112svh]"
    >
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        <source media="(max-width: 639px)" srcSet={mobile} />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          {...rest}
          className="absolute inset-0 h-full w-full object-cover object-[center_42%] sm:object-[center_44%]"
        />
      </picture>

      <h1 className="sr-only">Claude Lazy Starter, for Claude Pro and Max</h1>

      <Reveal
        delay={0.15}
        className="relative z-10 mx-auto mt-auto mb-[12svh] w-full max-w-[460px] px-6 sm:mb-[16svh]"
      >
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
    </section>
  );
}
