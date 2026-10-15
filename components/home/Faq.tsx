import Reveal from "@/components/motion/Reveal";
import { faq } from "@/content/faq";
import { ArticleSection } from "./Article";

/**
 * Questions, as semantic details and summary so they work by keyboard and
 * without JavaScript. The same copy feeds the FAQPage schema.
 */
export function Faq() {
  return (
    <ArticleSection id="questions" title="Questions">
      <div className="mx-auto mt-12 w-full max-w-[800px] border-t border-line-strong">
        {faq.map((item, i) => (
          <Reveal as="div" key={item.question} delay={i * 0.03}>
            <details className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-serif text-[21px] leading-snug text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="relative h-4 w-4 shrink-0 text-ink-soft"
                >
                  <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="max-w-[720px] pb-7 font-serif text-[18px] leading-relaxed text-ink-soft">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </ArticleSection>
  );
}
