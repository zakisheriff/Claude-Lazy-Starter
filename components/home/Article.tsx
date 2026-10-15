import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

/** A section of the landing article: an anchor, a serif heading, a column. */
export function ArticleSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 px-6 py-16 md:py-24", className)}
    >
      {title ? (
        <Reveal className="mx-auto w-full max-w-[800px]">
          <h2 className="font-serif text-[36px] leading-[1.15] font-normal tracking-[-0.015em] text-ink md:text-[44px]">
            {title}
          </h2>
        </Reveal>
      ) : null}
      {children}
    </section>
  );
}

/** The 800px reading column used for running text. */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      className={cn("prose-article mx-auto w-full max-w-[800px]", className)}
    >
      {children}
    </Reveal>
  );
}
