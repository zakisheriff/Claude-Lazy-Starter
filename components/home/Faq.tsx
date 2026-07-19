import Reveal from "@/components/motion/Reveal";
import { faq } from "@/content/faq";

/**
 * FAQ section. Rendered as semantic details/summary so it is keyboard operable
 * and readable without JavaScript. The same copy feeds the FAQPage schema.
 */
export function Faq() {
  return (
    <section className="flex min-h-screen flex-col justify-center px-6 py-24 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Questions worth answering first
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {faq.map((item, i) => (
            <Reveal as="div" key={item.question} delay={i * 0.04}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-xl font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 text-ink-soft"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
