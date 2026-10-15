"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { sections } from "./sections";

/**
 * A quiet progress rail on the left edge: one short line per section, with the
 * current section drawn longer and darker. Hidden over the hero and on small
 * screens.
 */
export function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = s.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "fixed top-1/2 left-0 z-30 hidden -translate-y-1/2 flex-col gap-4 transition-opacity duration-300 xl:flex",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.title}
          aria-current={active === s.id ? "true" : undefined}
          className="group flex h-3 items-center"
        >
          <span
            className={cn(
              "block h-px transition-all duration-300",
              active === s.id
                ? "w-8 bg-ink"
                : "w-5 bg-ink-faint group-hover:w-7 group-hover:bg-ink-soft",
            )}
          />
        </a>
      ))}
    </nav>
  );
}
